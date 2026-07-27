// public/js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const planType = urlParams.get('plan');
    
    const displayPlanName = document.getElementById('displayPlanName');
    const displayPlanPrice = document.getElementById('displayPlanPrice');
    const btnProceed = document.getElementById('btnProceedPayment');

    if (!planType || (planType !== 'premium' && planType !== 'vip')) {
        AppNotify.error('Invalid membership plan selected. Please go back and select a valid plan.', 'CHECKOUT ERROR');
        if (btnProceed) btnProceed.disabled = true;
        return;
    }

    if (planType === 'premium') {
        if (displayPlanName) displayPlanName.innerText = 'PREMIUM PLAN';
        if (displayPlanPrice) displayPlanPrice.innerText = '$9.99 / mo';
    } else if (planType === 'vip') {
        if (displayPlanName) {
            displayPlanName.innerText = 'VIP PLAN';
            displayPlanName.style.backgroundColor = '#d4af37';
        }
        if (displayPlanPrice) displayPlanPrice.innerText = '$24.99 / mo';
    }

    if (btnProceed) {
        btnProceed.addEventListener('click', async () => {
            btnProceed.disabled = true;
            btnProceed.innerText = 'Connecting to Secure Server...';

            try {
                const response = await fetch('/api/v1/stripe/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan: planType })
                });

                const data = await response.json();

                if (response.ok && data.success && data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                } else {
                    AppNotify.error(data.message || 'Failed to initialize payment session. Please try again.', 'PAYMENT ERROR');
                    btnProceed.disabled = false;
                    btnProceed.innerText = 'Proceed to Secure Payment';
                }
            } catch (error) {
                console.error('Checkout error:', error);
                AppNotify.error('A network error occurred. Please check your connection.', 'NETWORK ERROR');
                btnProceed.disabled = false;
                btnProceed.innerText = 'Proceed to Secure Payment';
            }
        });
    }
});