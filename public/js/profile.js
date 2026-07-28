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
                    if (window.AppNotify) {
                        AppNotify.success("Cập nhật thông tin hồ sơ thành công!", "PROFILE UPDATED");
                    } else {
                        alert("Cập nhật thông tin thành công!");
                    }
                    setTimeout(() => window.location.reload(), 1200);
                } else {
                    if (window.AppNotify) {
                        AppNotify.error(result.message || "Có lỗi xảy ra.", "UPDATE FAILED");
                    } else {
                        alert(result.message || "Lỗi cập nhật.");
                    }
                }
            } catch (err) {
                console.error("Lỗi:", err);
            }
        });
    }

    if (formChangePassword) {
        formChangePassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formChangePassword);
            const data = Object.fromEntries(formData.entries());

            if (data.newPassword !== data.confirmNewPassword) {
                if (window.AppNotify) {
                    return AppNotify.error("Mật khẩu xác nhận không khớp!", "VALIDATION ERROR");
                } else {
                    return alert("Mật khẩu xác nhận không khớp!");
                }
            }

            try {
                const res = await fetch('/api/v1/users/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    if (window.AppNotify) {
                        AppNotify.success("Đổi mật khẩu thành công!", "PASSWORD CHANGED");
                    } else {
                        alert("Đổi mật khẩu thành công!");
                    }
                    formChangePassword.reset();
                } else {
                    if (window.AppNotify) {
                        AppNotify.error(result.message || "Có lỗi xảy ra.", "CHANGE FAILED");
                    } else {
                        alert(result.message || "Đổi mật khẩu thất bại.");
                    }
                }
            } catch (err) {
                console.error("Lỗi:", err);
            }
        });
    }
});