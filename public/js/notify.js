const AppNotify = {
    // Tạo cấu trúc HTML Modal trên trang nếu chưa có
    _init() {
        if (document.getElementById('appModalOverlay')) return;

        const modalHTML = `
            <div id="appModalOverlay" class="app-modal-overlay">
                <div id="appModalCard" class="app-modal-card">
                    <div id="appModalIcon" class="app-modal-icon"></div>
                    <h3 id="appModalTitle" class="app-modal-title"></h3>
                    <p id="appModalMessage" class="app-modal-message"></p>
                    <div id="appModalActions" class="app-modal-actions"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    // Hàm hiển thị Popup chung
    show({ type = 'info', title, message, confirmText = 'OK', cancelText = null, onConfirm, onCancel }) {
        this._init();

        const overlay = document.getElementById('appModalOverlay');
        const card = document.getElementById('appModalCard');
        const icon = document.getElementById('appModalIcon');
        const titleElem = document.getElementById('appModalTitle');
        const msgElem = document.getElementById('appModalMessage');
        const actionsElem = document.getElementById('appModalActions');

        // Set type class
        card.className = `app-modal-card ${type}`;

        // Set Icon
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            confirm: '?'
        };
        icon.innerHTML = icons[type] || 'ℹ';

        // Set Text
        titleElem.innerText = title || type.toUpperCase();
        msgElem.innerText = message || '';

        // Reset & Render Buttons
        actionsElem.innerHTML = '';

        if (cancelText) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'app-modal-btn app-modal-btn-secondary';
            cancelBtn.innerText = cancelText;
            cancelBtn.onclick = () => {
                this.close();
                if (onCancel) onCancel();
            };
            actionsElem.appendChild(cancelBtn);
        }

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'app-modal-btn app-modal-btn-primary';
        confirmBtn.innerText = confirmText;
        confirmBtn.onclick = () => {
            this.close();
            if (onConfirm) onConfirm();
        };
        actionsElem.appendChild(confirmBtn);

        // Hiển thị Overlay
        setTimeout(() => overlay.classList.add('active'), 10);
    },

    close() {
        const overlay = document.getElementById('appModalOverlay');
        if (overlay) overlay.classList.remove('active');
    },

    // 1. Thông báo THÀNH CÔNG
    success(message, title = 'SUCCESS') {
        this.show({ type: 'success', title, message });
    },

    // 2. Thông báo LỖI
    error(message, title = 'ERROR') {
        this.show({ type: 'error', title, message });
    },

    // 3. Thông báo THÔNG TIN
    info(message, title = 'INFORMATION') {
        this.show({ type: 'info', title, message });
    },

    // 4. Thông báo XÁC NHẬN (Confirm Dialog - Dùng Promise / Async/Await)
    confirm(message, title = 'CONFIRM ACTION') {
        return new Promise((resolve) => {
            this.show({
                type: 'confirm',
                title,
                message,
                confirmText: 'YES',
                cancelText: 'CANCEL',
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }
};