// public/js/register.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) return;

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const btnSubmit = document.getElementById('btnSubmit');
        
        // 1. Validate phía Client
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        
        if (password !== confirmPassword) {
            AppNotify.error('Passwords do not match!', 'VALIDATION ERROR');
            return;
        }

        // 2. Chuẩn bị dữ liệu
        const formData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            username: form.username.value,
            email: form.email.value,
            password: form.password.value,
        };

        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Creating account...';

        // 3. Gửi request lên Backend
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
                AppNotify.success('Registration successful! Redirecting to login...', 'WELCOME');
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 1500);
            } else {
                AppNotify.error(data.message || 'Registration failed. Please try again.', 'REGISTRATION FAILED');
                btnSubmit.disabled = false;
                btnSubmit.innerText = 'Register';
            }
        } catch (error) {
            console.error('Error during registration:', error);
            AppNotify.error('A network error occurred. Please try again later.', 'NETWORK ERROR');
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Register';
        }
    });
});