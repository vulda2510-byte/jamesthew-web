document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');
    
    if (!countdownElement) return;

    let seconds = 5;
    
    // Tạo bộ đếm lùi mỗi 1 giây (1000ms)
    const interval = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;
        
        // Khi thời gian về 0, dừng bộ đếm và chuyển hướng
        if (seconds <= 0) {
            clearInterval(interval);
            window.location.href = '/'; // Đổi thành '/profile' nếu bạn muốn điều hướng vào trang cá nhân
        }
    }, 1000);
});