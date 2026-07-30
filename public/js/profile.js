// public/js/profile.js - Standalone Tab & Profile Logic

function switchProfileTab(tabName, clickedBtn) {
    // 1. Remove class active khỏi tất cả các nút Tab
    const allTabBtns = document.querySelectorAll('.tab-btn');
    allTabBtns.forEach(btn => btn.classList.remove('active'));

    // 2. Ẩn tất cả các khung nội dung
    const allTabPanes = document.querySelectorAll('.tab-pane');
    allTabPanes.forEach(pane => pane.classList.remove('active'));

    // 3. Khai báo Tab được chọn
    clickedBtn.classList.add('active');
    const targetPane = document.getElementById('tab-' + tabName);
    if (targetPane) {
        targetPane.classList.add('active');
    }
}
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SỬA LỖI CHUYỂN TAB (TAB SWITCHER ENGINE)
    const tabButtons = document.querySelectorAll('.profile-tab-btn');
    const tabPanes = document.querySelectorAll('.profile-tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTabId = button.getAttribute('data-tab');

            // Deactivate all buttons & panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Activate clicked button & corresponding pane
            button.classList.add('active');
            const activePane = document.getElementById(targetTabId);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });

    // 2. FORM UPDATE PROFILE AJAX
    const formUpdateProfile = document.getElementById("formUpdateProfile");
    if (formUpdateProfile) {
        formUpdateProfile.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formUpdateProfile);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/api/v1/users/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert("Cập nhật thông tin hồ sơ thành công!");
                    window.location.reload();
                } else {
                    alert(result.message || "Cập nhật thất bại.");
                }
            } catch (err) {
                console.error("Lỗi:", err);
                alert("Lỗi kết nối tới máy chủ.");
            }
        });
    }

    // 3. FORM CHANGE PASSWORD AJAX
    const formChangePassword = document.getElementById("formChangePassword");
    if (formChangePassword) {
        formChangePassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formChangePassword);
            const data = Object.fromEntries(formData.entries());

            if (data.newPassword !== data.confirmNewPassword) {
                return alert("Mật khẩu xác nhận không khớp!");
            }

            try {
                const res = await fetch('/api/v1/users/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert("Đổi mật khẩu thành công!");
                    formChangePassword.reset();
                } else {
                    alert(result.message || "Đổi mật khẩu thất bại.");
                }
            } catch (err) {
                console.error("Lỗi:", err);
                alert("Lỗi kết nối tới máy chủ.");
            }
        });
    }

    // 4. TIM KIEM USER
    const searchUserForm = document.getElementById("searchUserForm");
    if (searchUserForm) {
        searchUserForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = document.getElementById("searchInput").value.trim();
            if (query) {
                window.location.href = `/users/search?q=${encodeURIComponent(query)}`;
            }
        });
    }
});

// 5. UPLOAD AVATAR TRIGGER
function triggerAvatarUpload() {
    const avatarInput = document.getElementById("avatarInput");
    if (avatarInput) {
        avatarInput.click();
        avatarInput.onchange = async () => {
            if (avatarInput.files && avatarInput.files[0]) {
                const formData = new FormData();
                formData.append("avatar", avatarInput.files[0]);

                try {
                    const res = await fetch('/api/v1/users/avatar', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await res.json();
                    if (result.success) {
                        alert("Đã cập nhật ảnh đại diện thành công!");
                        window.location.reload();
                    } else {
                        alert(result.message || "Lỗi tải ảnh.");
                    }
                } catch (err) {
                    console.error("Lỗi upload avatar:", err);
                }
            }
        };
    }
}