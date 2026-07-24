// public/js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const planType = urlParams.get('plan'); // 'premium' hoặc 'vip'
    
    const displayPlanName = document.getElementById('displayPlanName');
    const displayPlanPrice = document.getElementById('displayPlanPrice');
    const btnProceed = document.getElementById('btnProceedPayment');
    const alertBox = document.getElementById('checkoutAlert');

    // 1. Validate và hiển thị thông tin gói
    if (!planType || (planType !== 'premium' && planType !== 'vip')) {
        showAlert('Invalid membership plan selected. Please go back and select a valid plan.');
        btnProceed.disabled = true;
        return;
    }

    if (planType === 'premium') {
        displayPlanName.innerText = 'PREMIUM PLAN';
        displayPlanPrice.innerText = '$9.99 / mo';
    } else if (planType === 'vip') {
        displayPlanName.innerText = 'VIP PLAN';
        displayPlanName.style.backgroundColor = '#d4af37'; // Màu vàng gold
        displayPlanPrice.innerText = '$24.99 / mo';
    }

    // 2. Xử lý sự kiện bấm thanh toán
    btnProceed.addEventListener('click', async () => {
        btnProceed.disabled = true;
        btnProceed.innerText = 'Connecting to Secure Server...';
        alertBox.style.display = 'none';

        try {
            // Gọi API Backend (Bạn cần viết API /api/v1/stripe/create-checkout-session ở Backend)
            const response = await fetch('/api/v1/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planType })
            });

            const data = await response.json();

            if (response.ok && data.success && data.checkoutUrl) {
                // Redirect người dùng đến trang thanh toán của Stripe
                window.location.href = data.checkoutUrl;
            } else {
                showAlert(data.message || 'Failed to initialize payment session. Please try again.');
                btnProceed.disabled = false;
                btnProceed.innerText = 'Proceed to Secure Payment';
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showAlert('A network error occurred. Please check your connection.');
            btnProceed.disabled = false;
            btnProceed.innerText = 'Proceed to Secure Payment';
        }
    });

    function showAlert(message) {
        alertBox.innerText = message;
        alertBox.style.display = 'block';
    }
});