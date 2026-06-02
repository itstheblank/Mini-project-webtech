// UI Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfoDiv = document.getElementById('user-info');
const userNameSpan = document.getElementById('user-name');
const userAvatarImg = document.getElementById('user-avatar');
const dashboardDiv = document.getElementById('dashboard');

// Init
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// 1. Xử lý Đăng nhập Google
loginBtn.addEventListener('click', () => {
    window.location.href = '/auth/google';
});

logoutBtn.addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.reload();
});

async function checkLoginStatus() {
    try {
        const res = await fetch('/api/user');
        if (res.ok) {
            const user = await res.json();
            loginBtn.classList.add('hidden');
            userInfoDiv.classList.remove('hidden');
            dashboardDiv.classList.remove('hidden');
            
            userNameSpan.textContent = user.name;
            userAvatarImg.src = user.picture;
        }
    } catch (e) {
        console.log('Chưa đăng nhập');
    }
}

// 2. Chuyển Tab Gmail
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    event.target.classList.add('active');
}

// 3. Lấy Email
document.getElementById('check-mail-btn').addEventListener('click', async () => {
    const list = document.getElementById('email-list');
    list.innerHTML = '<li>Đang tải...</li>';
    try {
        const res = await fetch('/api/emails');
        const emails = await res.json();
        list.innerHTML = '';
        if(emails.length === 0) list.innerHTML = '<li>Không có email.</li>';
        emails.forEach(email => {
            list.innerHTML += `
                <li>
                    <strong>${email.subject || '(Không có tiêu đề)'}</strong>
                    <span>Từ: ${email.from}</span>
                </li>
            `;
        });
    } catch (e) {
        list.innerHTML = '<li>Lỗi khi tải email</li>';
    }
});

// 4. Gửi Email
document.getElementById('email-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const status = document.getElementById('email-status');
    btn.disabled = true;
    status.textContent = 'Đang gửi...';
    
    const payload = {
        to: document.getElementById('email-to').value,
        subject: document.getElementById('email-subject').value,
        body: document.getElementById('email-body').value
    };
    
    try {
        const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if(res.ok) {
            status.textContent = 'Gửi thành công!';
            status.style.color = 'green';
            e.target.reset();
        } else {
            status.textContent = 'Gửi thất bại: ' + (data.error || '');
            status.style.color = 'red';
        }
    } catch (err) {
        status.textContent = 'Lỗi gửi email.';
    }
    btn.disabled = false;
});

// 5. Chatbot Gemini
document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const box = document.getElementById('chat-box');
    const msg = input.value;
    
    if(!msg) return;
    
    // Thêm tin nhắn user
    box.innerHTML += `<div class="message user">${msg}</div>`;
    input.value = '';
    box.scrollTop = box.scrollHeight;
    
    // Hiện đang nhập
    const loadingId = 'loading-' + Date.now();
    box.innerHTML += `<div class="message ai" id="${loadingId}">...</div>`;
    box.scrollTop = box.scrollHeight;
    
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        document.getElementById(loadingId).remove();
        
        if (res.ok) {
            box.innerHTML += `<div class="message ai">${data.reply.replace(/\n/g, '<br>')}</div>`;
        } else {
            box.innerHTML += `<div class="message ai" style="color:red">Lỗi: ${data.error}</div>`;
        }
    } catch (err) {
        document.getElementById(loadingId).remove();
        box.innerHTML += `<div class="message ai" style="color:red">Không thể kết nối.</div>`;
    }
    box.scrollTop = box.scrollHeight;
});

// 6. Thanh toán Ngân Lượng
document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    
    const payload = {
        amount: document.getElementById('amount').value,
        order_info: document.getElementById('order-info').value
    };
    
    try {
        const res = await fetch('/api/payment', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
        } else {
            alert('Lỗi tạo URL thanh toán');
            btn.disabled = false;
        }
    } catch (err) {
        alert('Lỗi kết nối API thanh toán');
        btn.disabled = false;
    }
});
