document.addEventListener("DOMContentLoaded", () => {
    const formUpdateProfile = document.getElementById("formUpdateProfile");
    const formChangePassword = document.getElementById("formChangePassword");
    const alertBox = document.getElementById("alertBox");

    function showAlert(message, type = 'success') {
        alertBox.className = `alert alert-${type} rounded-4 border-0 shadow-sm mb-4`;
        alertBox.innerHTML = message;
        alertBox.classList.remove('d-none');
        setTimeout(() => alertBox.classList.add('d-none'), 5000);
    }

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
                    showAlert("Cập nhật thông tin thành công!");
                } else {
                    showAlert(result.message || "Có lỗi xảy ra.", 'danger');
                }
            } catch (err) {
                showAlert("Lỗi kết nối đến server.", 'danger');
            }
        });
    }

    if (formChangePassword) {
        formChangePassword.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formChangePassword);
            const data = Object.fromEntries(formData.entries());

            if (data.newPassword !== data.confirmNewPassword) {
                return showAlert("Mật khẩu xác nhận không khớp!", 'danger');
            }

            try {
                const res = await fetch('/api/v1/users/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    showAlert("Đổi mật khẩu thành công!");
                    formChangePassword.reset();
                } else {
                    showAlert(result.message || "Có lỗi xảy ra.", 'danger');
                }
            } catch (err) {
                showAlert("Lỗi kết nối đến server.", 'danger');
            }
        });
    }
});