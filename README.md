# Tổng hợp mini project cho môn IT4409: Web technologies & e-Services

Đây là repository tổng hợp các mini project bao gồm cả Frontend và Backend.

## Cấu trúc repository

Được chia thành các project với mức độ phức tạp tăng dần:

### 1. Mini-project 1+2: Hệ quản trị nội dung cơ bản

**- Mô tả:** Xây dựng trang web hiển thị thông tin tĩnh và một trang Admin Panel cho phép quản lí nội dung động hoàn toàn ở phía frontend.

**- Tính năng:**

* Layout Grid Responsive hỗ trợ thay đổi số cột hiển thị.
* Quản lý Top Menu và Left Menu động.
* Tích hợp trình soạn thảo văn bản phong phú (QuillJS).
* Lưu trữ dữ liệu hoàn toàn bằng **`localStorage`** của trình duyệt.

******- Techstack:****** HTML5, CSS3 (W3.CSS), Vanilla JavaScript.

### 2. Mini-project 3: Node.js Backend & API Integrations

**- Mô tả:** Xây dựng một server Backend bằng Node.js để xử lí logic và kết nối với dịch vụ của các bên thứ ba.

**- Tính năng:**

* ******Google OAuth 2.0:****** Tính năng đăng nhập bằng tài khoản Google một cách an toàn.
* ******Gmail API:****** Cho phép đọc 5 email mới nhất và gửi email trực tiếp từ web.
* ******Gemini API:****** Tích hợp AI Chatbot thông minh từ Google.
* ******VietQR API:****** Tạo mã QR thanh toán ngân hàng tự động.

**- ****Techstack:****** Node.js, Express, Axios, Googleapis, **`@google/genai`**.

### 3. Mini-Project 4: Wikipedia Search AJAX (Tích hợp vào CMS)

**- ****Mô tả:****** Nâng cấp từ Mini-Project 2 bằng cách thêm loại nội dung "Tìm kiếm Wikipedia".

**- ****Tính năng:******

* Tìm kiếm bài viết Wikipedia trực tiếp thông qua Wikipedia API.
* Xử lý AJAX mượt mà với kỹ thuật **`debounce`** (tránh gọi API liên tục khi gõ phím).
* Highlight tự động từ khóa tìm kiếm trong kết quả trả về.

**- ****Techstack:****** Vanilla JavaScript, Fetch API, CSS.

## Bản quyền và liên hệ

Dự án được phát triển trong quá trình học tập môn Công nghệ Web.

Sinh viên thực hiện: Trần Sỹ Nguyên - MSSV: 20235985 - lớp ICT01 K68
