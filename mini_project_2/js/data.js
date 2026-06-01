const defaultData = {
    topMenus: [
        { id: "home", name: "Trang chủ", isHome: true, icon: "fas fa-home" },
        { id: "info", name: "Thông tin môn học" },
        { id: "web-tech", name: "Các công nghệ web" },
        { id: "student-info", name: "Thông tin sinh viên" },
    ],
    leftMenus: {
        "info": [
            { id: "info-1", name: "Mô tả tóm tắt (VN)" },
            { id: "info-2", name: "Sách tham khảo" }
        ],
        "student-info": [
            { id: "stu-cv", name: "CV" },
            { id: "stu-projects", name: "Các dự án đã tham gia" },
            { id: "stu-community", name: "Sinh hoạt cộng đồng" }
        ]
    },
    contentLayouts: {
        "stu-cv": [
            { id: "cv-content-1", name: "Thông tin cá nhân", colSpan: 12, rowSpan: 1 }
        ]
    },
    contents: {
        "cv-content-1": "<div class='student-info'>...Nội dung HTML sinh viên...</div>"
    }
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