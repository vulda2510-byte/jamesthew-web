/* public/js/membership.js */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Multiplier Switcher (1x, 5x, 10x)
    const toggles = document.querySelectorAll('.multiplier-toggle');
    
    toggles.forEach(toggle => {
        const plan = toggle.getAttribute('data-plan');
        const buttons = toggle.querySelectorAll('.multiplier-btn');
        const card = document.getElementById(`card-${plan}`);
        if (!card) return;

        const basePrice = parseFloat(card.getAttribute('data-base-price')) || (plan === 'premium' ? 9.99 : 19.99);
        const displayPriceEl = document.getElementById(`display-price-${plan}`);
        const displayPeriodEl = document.getElementById(`display-period-${plan}`);
        const checkoutBtn = document.getElementById(`btn-checkout-${plan}`);

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const mult = parseInt(btn.getAttribute('data-mult')) || 1;
                const calculatedPrice = (basePrice * mult).toFixed(2);

                if (displayPriceEl) displayPriceEl.innerText = `$${calculatedPrice}`;
                if (displayPeriodEl) displayPeriodEl.innerText = mult === 1 ? '/month' : ` / ${mult} months`;

                if (checkoutBtn) {
                    const currentHref = checkoutBtn.getAttribute('href');
                    if (currentHref) {
                        const url = new URL(currentHref, window.location.origin);
                        url.searchParams.set('mult', mult);
                        checkoutBtn.setAttribute('href', url.pathname + url.search);
                    }
                }
            });
        });
    });

    // 2. Plan Review Tab Switcher (Free / Premium / VIP)
    const tabBtns = document.querySelectorAll('.review-tab-btn');
    const tabContents = document.querySelectorAll('.plan-review-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPlan = btn.getAttribute('data-target');

            // Switch active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch active review content card
            tabContents.forEach(content => {
                if (content.id === `review-${targetPlan}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
});