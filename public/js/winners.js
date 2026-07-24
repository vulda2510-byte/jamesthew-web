document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('winnerFilterForm');
    
    async function loadWinners() {
        const formData = new FormData(form);
        const params = new URLSearchParams(formData).toString();
        const tbody = document.getElementById('winnersTableBody');
        
        try {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Đang tải dữ liệu...</td></tr>`;
            const res = await fetch(`/api/v1/contests/winners/list?${params}`);
            const result = await res.json();

            if (result.success && result.data.length > 0) {
                tbody.innerHTML = result.data.map(w => {
                    let rankBadge = w.rank === 1 ? '<span class="badge bg-warning text-dark px-3 py-2 rounded-pill">🥇 Quán Quân</span>' 
                        : w.rank === 2 ? '<span class="badge bg-secondary px-3 py-2 rounded-pill">🥈 Á Quân</span>'
                        : w.rank === 3 ? '<span class="badge bg-danger px-3 py-2 rounded-pill">🥉 Hạng 3</span>'
                        : `<span class="badge bg-light text-dark border px-3 py-2 rounded-pill">Hạng ${w.rank}</span>`;

                    return `
                        <tr>
                            <td class="py-3">${rankBadge}</td>
                            <td class="text-start fw-bold py-3">@${w.winner?.username || 'Thành viên'}</td>
                            <td class="text-start text-muted py-3">${w.contest?.title || 'N/A'}</td>
                            <td class="text-success fw-bold py-3">${w.prize || 'Cúp kỷ niệm'}</td>
                            <td class="py-3">${new Date(w.created_at).toLocaleDateString('vi-VN')}</td>
                        </tr>
                    `;
                }).join('');
            } else {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-5">Không tìm thấy dữ liệu.</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-5">Lỗi kết nối dữ liệu.</td></tr>`;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loadWinners();
    });

    // Tải dữ liệu lần đầu khi vào trang
    loadWinners();
});