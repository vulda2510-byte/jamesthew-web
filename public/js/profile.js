// public/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
    const formUpdateProfile = document.getElementById("formUpdateProfile");
    const formChangePassword = document.getElementById("formChangePassword");

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
                    AppNotify.success("Cập nhật thông tin thành công!", "PROFILE UPDATED");
                } else {
                    AppNotify.error(result.message || "Có lỗi xảy ra.", "UPDATE FAILED");
                }
            } catch (err) {
                AppNotify.error("Lỗi kết nối đến server.", "NETWORK ERROR");
            }
        });
    }

    if (formChangePassword) {
        formChangePassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formChangePassword);
            const data = Object.fromEntries(formData.entries());

            if (data.newPassword !== data.confirmNewPassword) {
                return AppNotify.error("Mật khẩu xác nhận không khớp!", "VALIDATION ERROR");
            }

            try {
                const res = await fetch('/api/v1/users/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    AppNotify.success("Đổi mật khẩu thành công!", "PASSWORD CHANGED");
                    formChangePassword.reset();
                } else {
                    AppNotify.error(result.message || "Có lỗi xảy ra.", "CHANGE FAILED");
                }
            } catch (err) {
                AppNotify.error("Lỗi kết nối đến server.", "NETWORK ERROR");
            }
        });
    }
});