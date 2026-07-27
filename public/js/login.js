// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const btnSubmit = document.getElementById('btnSubmit');
        
        const formData = {
            email: form.email.value,
            password: form.password.value,
            rememberMe: form.rememberMe.checked
        };

        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Logging in...';

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
                AppNotify.success('Login successful! Redirecting...', 'SUCCESS');
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                setTimeout(() => {
                    window.location.href = '/'; 
                }, 1000);
            } else {
                AppNotify.error(data.message || 'Invalid email or password.', 'LOGIN FAILED');
                btnSubmit.disabled = false;
                btnSubmit.innerText = 'Login';
            }
        } catch (error) {
            console.error('Error during login:', error);
            AppNotify.error('A network error occurred. Please try again later.', 'NETWORK ERROR');
            btnSubmit.disabled = false;
            btnSubmit.innerText = 'Login';
        }
    });
});