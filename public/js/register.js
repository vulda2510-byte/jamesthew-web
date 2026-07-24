// public/js/register.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) return; // Tránh lỗi nếu chạy nhầm trang

    registerForm.addEventListener('submit', async function(e) {
        // 1. Chặn reload trang
        e.preventDefault();
        
        const form = e.target;
        const btnSubmit = document.getElementById('btnSubmit');
        const alertMessage = document.getElementById('alertMessage');
        
        // 2. Validate phía Client: Kiểm tra mật khẩu khớp nhau
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match!', 'error');
            return;
        }

        // 3. Chuẩn bị dữ liệu và trạng thái loading
        const formData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            username: form.username.value,
            email: form.email.value,
            password: form.password.value,
        };

        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Creating account...';
        alertMessage.style.display = 'none';

        // 4. Gửi request lên Backend
        try {
            const response = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Thành công: Thông báo và chuyển hướng
                showAlert('Registration successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 1500);
            } else {
                // Lỗi từ server (VD: Trùng email)
                showAlert(data.message || 'Registration failed. Please try again.', 'error');
                btnSubmit.disabled = false;
                btnSubmit.innerText = 'Register';
            }
        } catch (error) {
            console.error('Error during registration:', error);
            showAlert('A network error occurred. Please try again later.', 'error');
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Register';
        }
    });

    // Hàm tiện ích để hiển thị thông báo
    function showAlert(message, type) {
        const alertBox = document.getElementById('alertMessage');
        alertBox.innerText = message;
        alertBox.style.display = 'block';
        alertBox.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        alertBox.style.color = type === 'success' ? '#155724' : '#721c24';
        alertBox.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    }
});