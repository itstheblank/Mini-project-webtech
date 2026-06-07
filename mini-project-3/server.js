require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { google } = require('googleapis');
const { GoogleGenAI } = require('@google/genai');
const crypto = require('crypto');
const path = require('path');
const axios = require('axios');

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
            const date = headers.find(h => h.name === 'Date')?.value;
            emails.push({ id: msg.id, subject, from, date, snippet: messageData.data.snippet });
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

// ---4. VIETQR API ---
app.post('/api/payment', async (req, res) => {
    const { amount, order_info } = req.body;

    try {
        const payload = {
            accountNo: process.env.VIETQR_ACCOUNT_NO,
            accountName: process.env.VIETQR_ACCOUNT_NAME,
            amount: Number(amount),
            addInfo: order_info,
            format: "text",
            template: "compact",
            acqId: Number(process.env.VIETQR_BANK_ID)
        };

        const response = await axios.post('https://api.vietqr.io/v2/generate', payload);

        if (response.data && response.data.code === '00') {
            res.json({
                success: true,
                qrDataURL: response.data.data.qrDataURL
            });
        } else {
            res.status(500).json({ error: 'Không thể tạo mã QR' });
        }
    } catch (error) {
        console.error('Lỗi VietQR', error);
        res.status(500).json({ error: 'Lỗi kết nối API VietQR' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
