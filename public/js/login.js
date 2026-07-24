// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        // 1. Chặn reload trang
        e.preventDefault();
        
        const form = e.target;
        const btnSubmit = document.getElementById('btnSubmit');
        const alertMessage = document.getElementById('alertMessage');
        
        // 2. Lấy dữ liệu từ form
        const formData = {
            email: form.email.value,
            password: form.password.value,
            rememberMe: form.rememberMe.checked // Lấy trạng thái của checkbox Remember Me
        };

        // 3. Hiệu ứng loading
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Logging in...';
        alertMessage.style.display = 'none';

        // 4. Gửi request lên Backend
        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Đăng nhập thành công
                showAlert('Login successful! Redirecting...', 'success');
                
                // Lưu token vào localStorage (nếu backend của bạn dùng Bearer Token thay vì HttpOnly Cookie)
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Chuyển hướng người dùng về trang chủ (hoặc dashboard)
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 1000);
            } else {
                // Sai email hoặc mật khẩu
                showAlert(data.message || 'Invalid email or password.', 'error');
                btnSubmit.disabled = false;
                btnSubmit.innerText = 'Login';
            }
        } catch (error) {
            console.error('Error during login:', error);
            showAlert('A network error occurred. Please try again later.', 'error');
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Login';
        }
    });

    // Hàm hiển thị thông báo
    function showAlert(message, type) {
        const alertBox = document.getElementById('alertMessage');
        alertBox.innerText = message;
        alertBox.style.display = 'block';
        alertBox.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        alertBox.style.color = type === 'success' ? '#155724' : '#721c24';
        alertBox.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    }
});