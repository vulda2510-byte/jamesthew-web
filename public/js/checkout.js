/* ==========================================================================
   CHECKOUT PAGE LOGIC & STRIPE REDIRECT HANDLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const planType = urlParams.get('plan') || 'premium';
    const multParam = parseInt(urlParams.get('mult'), 10) || 1;
    
    const displayPlanName = document.getElementById('displayPlanName');
    const displayPlanPrice = document.getElementById('displayPlanPrice');
    const btnProceed = document.getElementById('btnProceedPayment');
    const alertBox = document.getElementById('checkoutAlert');
    const inputPlan = document.getElementById('inputPlan');
    const inputMult = document.getElementById('inputMult');

    // Cập nhật trường hidden trong form
    if (inputPlan) inputPlan.value = planType;
    if (inputMult) inputMult.value = multParam;

    // Giá cơ sở
    const basePrices = {
        premium: 9.99,
        vip: 19.99
    };

    // Kiểm tra gói hợp lệ
    if (planType !== 'premium' && planType !== 'vip') {
        showAlert('Invalid membership plan selected. Please return to plans and select a valid tier.');
        if (btnProceed) btnProceed.disabled = true;
        return;
    }

    // Hiển thị giao diện tên gói & tính toán tổng giá theo Multiplier (1x, 5x, 10x)
    const currentBasePrice = basePrices[planType] || 9.99;
    const totalPrice = (currentBasePrice * multParam).toFixed(2);
    const periodText = multParam === 1 ? '/ mo' : ` / ${multParam} mos`;

    if (planType === 'premium') {
        if (displayPlanName) {
            displayPlanName.innerText = 'PREMIUM PLAN';
            displayPlanName.className = 'plan-badge plan-badge-premium';
        }
        if (displayPlanPrice) {
            displayPlanPrice.innerText = `$${totalPrice} ${periodText}`;
        }
    } else if (planType === 'vip') {
        if (displayPlanName) {
            displayPlanName.innerText = 'VIP PLAN';
            displayPlanName.className = 'plan-badge plan-badge-vip';
        }
        if (displayPlanPrice) {
            displayPlanPrice.innerText = `$${totalPrice} ${periodText}`;
        }
    }

    // Xử lý sự kiện click nút Thanh toán
    if (btnProceed) {
        btnProceed.addEventListener('click', async (e) => {
            e.preventDefault();
            btnProceed.disabled = true;
            btnProceed.innerText = 'CONNECTING TO SECURE GATEWAY...';

            try {
                const response = await fetch('/api/v1/stripe/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        plan: planType,
                        mult: multParam 
                    })
                });

                const data = await response.json();

                if (response.ok && data.success && data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                } else {
                    // Fallback: nếu API chưa sẵn sàng, submit form truyền thống
                    const form = document.getElementById('checkoutForm');
                    if (form) {
                        form.submit();
                    } else {
                        showAlert(data.message || 'Failed to initialize payment session. Please try again.');
                        resetButton();
                    }
                }
            } catch (error) {
                console.error('Checkout error:', error);
                // Nếu fetch API lỗi kết nối, submit form fallback
                const form = document.getElementById('checkoutForm');
                if (form) {
                    form.submit();
                } else {
                    showAlert('A network error occurred. Please check your connection.');
                    resetButton();
                }
            }
        });
    }

    function showAlert(msg) {
        if (alertBox) {
            alertBox.innerText = msg;
            alertBox.style.display = 'block';
        }
    }

    function resetButton() {
        if (btnProceed) {
            btnProceed.disabled = false;
            btnProceed.innerText = 'PROCEED TO SECURE PAYMENT';
        }
    }
});