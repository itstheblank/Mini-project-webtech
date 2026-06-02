require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { google } = require('googleapis');
const { GoogleGenAI } = require('@google/genai');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
}));

// --- 1. GOOGLE AUTH SETUP ---
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
];

app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent' // Để luôn lấy được refresh_token
    });
    res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        req.session.tokens = tokens;
        res.redirect('/');
    } catch (error) {
        console.error('Lỗi khi lấy token:', error);
        res.status(500).send('Authentication failed');
    }
});

// Middleware kiểm tra đăng nhập
function checkAuth(req, res, next) {
    if (!req.session.tokens) return res.status(401).json({ error: 'Chưa đăng nhập' });
    oauth2Client.setCredentials(req.session.tokens);
    next();
}

app.get('/api/user', checkAuth, async (req, res) => {
    try {
        const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
        const userInfo = await oauth2.userinfo.get();
        res.json(userInfo.data);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi lấy thông tin user' });
    }
});

app.post('/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// --- 2. GMAIL API ---
app.get('/api/emails', checkAuth, async (req, res) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        // Lấy danh sách 5 email mới nhất
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 5,
        });

        const messages = response.data.messages || [];
        const emails = [];

        for (const msg of messages) {
            const messageData = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id
            });
            const headers = messageData.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value;
            const from = headers.find(h => h.name === 'From')?.value;
            emails.push({ id: msg.id, subject, from, snippet: messageData.data.snippet });
        }
        res.json(emails);
    } catch (error) {
        console.error('Lỗi đọc email:', error);
        res.status(500).json({ error: 'Lỗi khi lấy email' });
    }
});

app.post('/api/send-email', checkAuth, async (req, res) => {
    const { to, subject, body } = req.body;
    try {
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `To: ${to}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            body
        ];
        const message = messageParts.join('\n');
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        res.json({ success: true, message: 'Gửi email thành công!' });
    } catch (error) {
        console.error('Lỗi gửi email:', error);
        res.status(500).json({ error: 'Gửi email thất bại' });
    }
});

// --- 3. GEMINI API ---
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Chưa cấu hình Gemini API Key' });

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
        });
        res.json({ reply: response.text });
    } catch (error) {
        console.error('Lỗi Gemini:', error);
        res.status(500).json({ error: 'Lỗi từ Gemini API: ' + error.message });
    }
});

// --- 4. NGÂN LƯỢNG API ---
app.post('/api/payment', (req, res) => {
    const { amount, order_info } = req.body;

    const merchant_site_code = process.env.NGANLUONG_MERCHANT_ID;
    const merchant_password = process.env.NGANLUONG_MERCHANT_PASSWORD;
    const receiver_email = process.env.NGANLUONG_RECEIVER_EMAIL;
    const url_nganluong = process.env.NGANLUONG_URL;

    const order_code = 'ORDER_' + Date.now();
    const return_url = 'http://localhost:3000/payment-success.html';
    const cancel_url = 'http://localhost:3000/';

    // Tạo mã checksum (Mã hóa MD5 theo tài liệu Ngân Lượng)
    const stringToHash = merchant_site_code + ' ' + return_url + ' ' + receiver_email + ' ' +
        merchant_password + ' ' + order_code + ' ' + amount + ' ' + 'vnd' + ' ' +
        '1' + ' ' + '0' + ' ' + '0' + ' ' + '0' + ' ' + '0' + ' ' + order_info + ' ' + ' ' + ' ' + ' ' + ' ' + ' ';

    const secure_code = crypto.createHash('md5').update(stringToHash).digest('hex');

    // Chuyển hướng sang Ngân Lượng
    const params = new URLSearchParams({
        merchant_site_code,
        return_url,
        receiver: receiver_email,
        transaction_info: order_info,
        order_code,
        price: amount,
        currency: 'vnd',
        quantity: 1,
        tax: 0,
        discount: 0,
        fee_cal: 0,
        fee_shipping: 0,
        order_description: order_info,
        buyer_info: ' ', // Bắt buộc nhưng có thể để trống
        affiliate_code: ' ',
        secure_code
    });

    res.json({ paymentUrl: `${url_nganluong}?${params.toString()}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
