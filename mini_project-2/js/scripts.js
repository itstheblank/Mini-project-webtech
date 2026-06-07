// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}
// Function to show content and update button style
function showContent(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.w3-container');
  sections.forEach(section => section.classList.add('hidden'));

  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.w3-bar-item');
  buttons.forEach(button => button.classList.remove('active'));

  // Show selected section
  document.getElementById(sectionId).classList.remove('hidden');

  const sidebar = document.getElementById("mySidebar");
  sidebar.innerHTML = '';

  if (sectionId === 'courseInfo') {
    sidebar.innerHTML = `
    <h4 class="w3-bar-item"><b>Menu</b></h4>
    <a class="w3-bar-item w3-button w3-hover-black" href="#classInfo">Thông tin khai giảng</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#seminar">Thông tin Seminar</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#company">Thông tin công ty quan tâm</a>
  `;
  } else if (sectionId === 'info') {
    sidebar.innerHTML = `
    <h4 class="w3-bar-item"><b>Thông tin môn học</b></h4>
    <a class="w3-bar-item w3-button w3-hover-black" href="#summaryVN">Mô tả tóm tắt học phần (tiếng Việt) (*)</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#summaryEN">Mô tả tóm tắt học phần (tiếng Anh) (*)</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#contentVN">Nội dung tóm tắt học phần (tiếng Việt) (*)</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#contentEN">Nội dung tóm tắt học phần (tiếng Anh) (*)</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#reference">Sách tham khảo</a>

  `;
  } else if (sectionId === 'web-tech') {
    sidebar.innerHTML = `
    <h4 class="w3-bar-item"><b>Công nghệ Web</b></h4>
    <a class="w3-bar-item w3-button w3-hover-black" href="#frontend">1. Frontend (Giao diện người dùng)</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#backend">2. Backend (Máy chủ và xử lý dữ liệu)</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#database">3. Cơ sở dữ liệu</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#api">4. API và Tích hợp dịch vụ</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#devops">5. DevOps và Triển khai</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#security">6. Bảo mật</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#testing">7. Testing và Debugging</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#optimization">8. Performance Optimization</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#authentication">9. User Authentication & Authorization</a>
  `;
  } else if (sectionId === 'student-info') {
    sidebar.innerHTML = `
    <h4 class="w3-bar-item"><b>Thông tin sinh viên</b></h4>
    <a class="w3-bar-item w3-button w3-hover-black" href="#academic-info">Thông tin học tập</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#skills-info">Kĩ năng</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#projects-info">Dự án</a>
    <a class="w3-bar-item w3-button w3-hover-black" href="#hobbies-info">Sở thích</a>
  `;
  }

  // Add active class to clicked button
  event.target.classList.add('active');
}
window.onload = function () {
  initData();
  renderTopMenu();
  showContent('courseInfo');
};

function renderTopMenu() {
  const topMenus = JSON.parse(localStorage.getItem('topMenus')) || [];
  const topMenuContainer = document.querySelector('.w3-top .w3-bar');

  //Keep the toggle sidebar button
  let html = `<a class="w3-bar-item w3-button w3-right w3-hide-large w3-hover-white w3-large w3-theme-l1" href="javascript:void(0)" onclick="w3_open()"><i class="fa fa-bars"></i></a>`;

  topMenus.forEach(menu => {
    if (menu.isHome) {
      html += `<a href="#" onclick="showContent('${menu.id}')" class="w3-bar-item w3-button"><i class="${menu.icon}"></i></a>`;
    } else {
      html += `<a href="javascript:void(0)" onclick="showContent('${menu.id}')" class="w3-bar-item w3-button">${menu.name}</a>`;
    }
  });

  html += `<a href="javascript:void(0)" onclick="showAdminPage()" id="admin-page-btn" class="w3-bar-item w3-button"><b>Admin page</b></a>`;

  topMenuContainer.innerHTML = html;
}

function showAdminPage() {
  document.querySelectorAll('#content-container > .w3-container').forEach(e1 => e1.classList.add('hidden'));
  document.getElementById('admin-page').classList.remove('hidden');

  document.querySelectorAll('.w3-bar-item').forEach(b => b.classList.remove('active'));
  document.getElementById('admin-page-btn').classList.add('active');

  const topMenus = JSON.parse(localStorage.getItem('topMenus')) || [];
  const tbody = document.getElementById('admin-top-menu-tbody');
  let html = '';

  topMenus.forEach((menu, index) => {
    html += `<tr>
      <td>${menu.id}</td>
      <td>${menu.name || (menu.isHome ? 'Trang chủ (Logo)' : '')}</td>
      <td>
          <button class="w3-button w3-blue w3-small" onclick="viewAdminLeftMenu('${menu.id}')">Xem</button>
          ${!menu.isHome ? `<button class="w3-button w3-orange w3-small" onclick="editTopMenu(${index})">Sửa</button>
                            <button class="w3-button w3-red w3-small" onclick="deleteTopMenu(${index})">Xóa</button>` : ''}
        </td>
      </tr>`;
  });
  tbody.innerHTML = html;
}

function addTopMenu() {
  let id = prompt("Nhập ID cho menu mới:");
  let name = prompt("Nhập tên menu:");
  if (id && name) {
    let menus = JSON.parse(localStorage.getItem('topMenus'));
    menus.push({ id: id, name: name });
    localStorage.setItem('topMenus', JSON.stringify(menus));
    renderTopMenu();
    showAdminPage();
  }
}

function editTopMenu(index) {
  let menus = JSON.parse(localStorage.getItem('topMenus'));
  let newName = prompt("Sửa tên menu:", menus[index].name);
  if (newName) {
    menus[index].name = newName;
    localStorage.setItem('topMenus', JSON.stringify(menus));
    renderTopMenu();
    showAdminPage();
  }
}

function deleteTopMenu(index) {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    let menus = JSON.parse(localStorage.getItem('topMenus'));
    menus.splice(index, 1);
    localStorage.setItem('topMenus', JSON.stringify(menus));
    renderTopMenu();
    showAdminPage();
  }
}

// Logic cho Admin Menu Left
let currentTopMenuId = '';

function viewAdminLeftMenu(topMenuId) {
  currentTopMenuId = topMenuId;

  document.querySelectorAll('#content-container > .w3-container').forEach(e1 => e1.classList.add('hidden'));
  document.getElementById('admin-menu-left').classList.remove('hidden');

  const btnReset = document.getElementById('btn-reset-student');
  if (topMenuId === 'student-info') {
    btnReset.classList.remove('hidden');
  } else {
    btnReset.classList.add('hidden')
  }
  renderAdminLeftMenu();
}

function renderAdminLeftMenu() {
  const leftMenus = JSON.parse(localStorage.getItem('leftMenus')) || {};
  const items = leftMenus[currentTopMenuId] || [];

  const tbody = document.getElementById('admin-left-menu-tbody');
  let html = '';
  items.forEach((item, index) => {
    html += `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>
                <button class="w3-button w3-blue w3-small" onclick="viewAdminLayout('${item.id}')">Xem (Layout)</button>
                <button class="w3-button w3-orange w3-small" onclick="editLeftMenu(${index})">Sửa</button>
                <button class="w3-button w3-red w3-small" onclick="deleteLeftMenu(${index})">Xóa</button>
            </td>
        </tr>`;
  });
  tbody.innerHTML = html;
}

function addLeftMenu() {
  let id = prompt("Nhập ID cho menu trái mới:");
  let name = prompt("Nhập tên menu trái:");
  if (id && name) {
    let leftMenus = JSON.parse(localStorage.getItem('leftMenus')) || {};
    if (!leftMenus[currentTopMenuId]) leftMenus[currentTopMenuId] = [];
    leftMenus[currentTopMenuId].push({ id: id, name: name });
    localStorage.setItem('leftMenus', JSON.stringify(leftMenus));
    renderAdminLeftMenu();
  }
}

function editLeftMenu(index) {
  let leftMenus = JSON.parse(localStorage.getItem('leftMenus'));
  let newName = prompt('Sửa tên menu trái:', leftMenus[currentTopMenuId][index].name);
  if (newName) {
    leftMenus[currentTopMenuId][index].name = newName;
    localStorage.setItem('leftMenus', JSON.stringify(leftMenus));
    renderAdminLeftMenu();
  }
}

function deleteLeftMenu(index) {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    let leftMenus = JSON.parse(localStorage.getItem('leftMenus'));
    leftMenus[currentTopMenuId].splice(index, 1);
    localStorage.setItem('leftMenus', JSON.stringify(leftMenus));
    renderAdminLeftMenu();
  }
}

// Chức năng Reset
function resetStudentInfo() {
  if (confirm("Bạn có chắc chắn muốn Khôi phục thông tin sinh viên về mặc định (CV, Dự án, Sinh hoạt cộng đồng)?")) {
    let leftMenus = JSON.parse(localStorage.getItem('leftMenus'));
    leftMenus['student-info'] = [
      { id: "stu-cv", name: "CV" },
      { id: "stu-projects", name: "Các dự án đã tham gia" },
      { id: "stu-community", name: "Sinh hoạt cộng đồng" }
    ];

    let contentLayouts = JSON.parse(localStorage.getItem('contentLayouts')) || {};
    contentLayouts['stu-cv'] = [{ id: 'content-cv', name: 'Nội dung CV', colSpan: 12 }];
    contentLayouts['stu-projects'] = [{ id: 'content-projects', name: 'Danh sách dự án', colSpan: 12 }];
    contentLayouts['stu-community'] = [{ id: 'content-community', name: 'Hoạt động nổi bật', colSpan: 12 }];

    let contents = JSON.parse(localStorage.getItem('contents')) || {};
    contents['content-cv'] = `
      <h3 style="color: blue;">Sơ yếu lý lịch (CV)</h3>
      <img src="./assets/ava.jpg" alt="Student Photo" style="max-width: 150px; border-radius: 8px;">
      <p><b>Họ và tên:</b> Trần Sỹ Nguyên</p>
      <p><b>MSSV:</b> 20235985</p>
    `;
    contents['content-projects'] = `
      <h3 style="color: blue;">Các dự án đã tham gia</h3>
      <ul>
        <li><b>Dự án 1:</b> Quản lý đặt lịch khám bệnh cho bệnh nhân (Doctor Appointment) - Dùng React, MongoDB</li>
        <li><b>Dự án 2:</b> Hệ thống thương mại điện tử kĩ thuật số (AIMS) - Dùng JavaFX, Supabase</li>
      </ul>
    `;
    contents['content-community'] = `
      <h3 style="color: blue;">Sinh hoạt cộng đồng</h3>
      <ul>
        <li><b>Hoạt động 1:</b> Sinh viên tình nguyện tiếp sức mùa thi</li>
        <li><b>Hoạt động 2:</b> Tham gia tuần lễ sinh hoạt công dân đầu khóa</li>
      </ul>
    `;
    localStorage.setItem('leftMenus', JSON.stringify(leftMenus));
    localStorage.setItem('contentLayouts', JSON.stringify(contentLayouts));
    localStorage.setItem('contents', JSON.stringify(contents));
    renderAdminLeftMenu();
    alert("Khôi phục thông tin sinh viên thành công!");
  }
}

//Logic cho Admin Contents Layout
let currentLeftMenuId = '';

function viewAdminLayout(leftMenuId) {
  currentLeftMenuId = leftMenuId;
  document.querySelectorAll('#content-container > .w3-container').forEach(e1 => e1.classList.add('hidden'));
  document.getElementById('admin-contents-layout').classList.remove('hidden');
  renderAdminLayout();
}

function renderAdminLayout() {
  const layouts = JSON.parse(localStorage.getItem('contentLayouts')) || {};
  const items = layouts[currentLeftMenuId] || [];

  const tbody = document.getElementById('admin-layout-tbody');
  let tableHtml = '';
  let previewHtml = '<div class="grid-container">';

  items.forEach((item, index) => {
    tableHtml += `<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>Chiếm ${item.colSpan}/12 cột</td>
            <td>
                <button class="w3-button w3-blue w3-small" onclick="viewAdminContent('${item.id}')">Xem/Viết Bài</button>
                <button class="w3-button w3-orange w3-small" onclick="editLayoutContent(${index})">Sửa Layout</button>
                <button class="w3-button w3-red w3-small" onclick="deleteLayoutContent(${index})">Xóa</button>
            </td>
        </tr>`;

    previewHtml += `<div class="grid-preview-box" style="grid-column: span ${item.colSpan};">
            <b>${item.name}</b> (span ${item.colSpan})
        </div>`;
  });
  previewHtml += '</div>';

  tbody.innerHTML = tableHtml;
  document.getElementById('layout-preview-area').innerHTML = previewHtml;
}

function addLayoutContent() {
  let id = prompt("Nhập ID cho mục nội dung:");
  let name = prompt("Nhập tên mục nội dung:");
  let colSpan = prompt("Nhập số cột hiển thị trên grid (từ 1 đến 12, ví dụ: 12 là full chiều ngang, 6 là 50%):", "12");

  if (id && name && colSpan) {
    let layouts = JSON.parse(localStorage.getItem('contentLayouts')) || {};
    if (!layouts[currentLeftMenuId]) layouts[currentLeftMenuId] = [];

    layouts[currentLeftMenuId].push({ id: id, name: name, colSpan: parseInt(colSpan) || 12 });
    localStorage.setItem('contentLayouts', JSON.stringify(layouts));
    renderAdminLayout();
  }
}

function editLayoutContent(index) {
  let layouts = JSON.parse(localStorage.getItem('contentLayouts'));
  let item = layouts[currentLeftMenuId][index];

  let newName = prompt("Sửa tên mục nội dung:", item.name);
  let newColSpan = prompt("Sửa số cột hiển thị (1-12):", item.colSpan);

  if (newName && newColSpan) {
    item.name = newName;
    item.colSpan = parseInt(newColSpan) || 12;
    localStorage.setItem('contentLayouts', JSON.stringify(layouts));
    renderAdminLayout();
  }
}

function deleteLayoutContent(index) {
  if (confirm("Bạn có chắc chắn muốn xóa Layout này?")) {
    let layouts = JSON.parse(localStorage.getItem('contentLayouts'));
    layouts[currentLeftMenuId].splice(index, 1);
    localStorage.setItem('contentLayouts', JSON.stringify(layouts));
    renderAdminLayout();
  }
}

//Logic cho Admin Contents (Trình soạn thảo QuillJS)
let currentContentId = '';
let quill;

function viewAdminContent(contentId) {
  currentContentId = contentId;
  document.querySelectorAll('#content-container > .w3-container').forEach(e1 => e1.classList.add('hidden'));
  document.getElementById('admin-contents').classList.remove('hidden');

  if (!quill) {
    quill = new Quill('#editor-container', {
      theme: 'snow'
    });
  }

  const contents = JSON.parse(localStorage.getItem('contents')) || {};

  if (contents[contentId]) {
    quill.clipboard.dangerouslyPasteHTML(contents[contentId]);
  } else {
    quill.setText('');
  }
  renderContentPreview();
}

function saveContent() {
  let htmlContent = quill.root.innerHTML;
  let contents = JSON.parse(localStorage.getItem('contents')) || {};
  contents[currentContentId] = htmlContent;
  localStorage.setItem('contents', JSON.stringify(contents));
  alert('Đã lưu nội dung!');
  renderContentPreview();
}

function renderContentPreview() {
  const layouts = JSON.parse(localStorage.getItem('contentLayouts')) || {}
  const items = layouts[currentLeftMenuId] || [];
  const contents = JSON.parse(localStorage.getItem('contents')) || {};

  let html = '';
  items.forEach(item => {
    let contentHTML = contents[item.id] || '<p class="w3-text-grey w3-small">(Chưa có nội dung)</p>';

    html += `<div style="grid-column: span ${item.colSpan}; background: white; padding: 15px; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    ${contentHTML}
                 </div>`;
  });

  document.getElementById('content-preview').innerHTML = html;
}

