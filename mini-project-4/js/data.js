const defaultData = {
    topMenus: [
        { id: "home", name: "Trang chủ", isHome: true, icon: "fas fa-home" },
        { id: "info", name: "Thông tin môn học" },
        { id: "web-tech", name: "Các công nghệ web" },
        { id: "student-info", name: "Thông tin sinh viên" },
    ],
    leftMenus: {
        "courseInfo": [
            { id: "classInfo", name: "Thông tin khai giảng" },
            { id: "seminar", name: "Thông tin Seminar" },
            { id: "company", name: "Thông tin công ty quan tâm" },
        ],
        "info": [
            { id: "summaryVN", name: "Mô tả tóm tắt học phần (tiếng Việt) (*)" },
            { id: "summaryEN", name: "Mô tả tóm tắt học phần (tiếng Anh) (*)" },
            { id: "contentVN", name: "Nội dung tóm tắt học phần (tiếng Việt) (*)" },
            { id: "contentEN", name: "Nội dung tóm tắt học phần (tiếng Anh) (*)" },
            { id: "reference", name: "Sách tham khảo" },
        ],
        "web-tech": [
            { id: "frontend", name: "1. Frontend (Giao diện người dùng)" },
            { id: "backend", name: "2. Backend (Máy chủ và xử lý dữ liệu)" },
            { id: "database", name: "3. Cơ sở dữ liệu" },
            { id: "api", name: "4. API và Tích hợp dịch vụ" },
            { id: "devops", name: "5. DevOps và Triển khai" },
            { id: "security", name: "6. Bảo mật" },
            { id: "testing", name: "7. Testing và Debugging" },
            { id: "optimization", name: "8. Performance Optimization" },
            { id: "authentication", name: "9. User Authentication & Authorization" },
        ],
        "student-info": [
            { id: "academic-info", name: "Thông tin học tập" },
            { id: "skills-info", name: "Kĩ năng" },
            { id: "projects-info", name: "Dự án" },
            { id: "hobbies-info", name: "Sở thích" }
        ]
    },
    contentLayouts: {},
    contents: {}
};

//hàm khởi tạo dữ liệu
function initData() {
    if (!localStorage.getItem('topMenus')) {
        localStorage.setItem('topMenus', JSON.stringify(defaultData.topMenus));
        localStorage.setItem('leftMenus', JSON.stringify(defaultData.leftMenus));
        localStorage.setItem('contentLayouts', JSON.stringify(defaultData.contentLayouts));
        localStorage.setItem('contents', JSON.stringify(defaultData.contents));
    }
}