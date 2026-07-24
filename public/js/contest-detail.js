document.addEventListener("DOMContentLoaded", () => {
    // Tự động lấy Slug/ID từ URL (ví dụ: /contests/detail/vegan-innovation-challenge -> vegan-innovation-challenge)
    const parts = window.location.pathname.split('/');
    let contestId = parts[parts.length - 1]; 

    const contestDataSet = document.getElementById('contestData')?.dataset || {};
    const isUserLoggedIn = contestDataSet.loggedIn === 'true';

    async function loadContestDetail() {
        if (!contestId) {
            document.getElementById('contestDetailSection').innerHTML = '<p class="text-danger">Không tìm thấy mã cuộc thi hợp lệ.</p>';
            return;
        }

        try {
            const res = await fetch(`/api/v1/contests/${contestId}`);
            const result = await res.json();

            if (result.success && result.data) {
                const contest = result.data;
                renderOverview(contest);
                renderActionArea(contest);
                renderComments(contest.comments);
            } else {
                document.getElementById('contestDetailSection').innerHTML = `<p class="text-danger">${result.message || 'Cuộc thi không tồn tại.'}</p>`;
            }
        } catch (error) {
            console.error("Error loading contest details:", error);
            document.getElementById('contestDetailSection').innerHTML = '<p class="text-danger">Lỗi kết nối đến máy chủ khi tải dữ liệu.</p>';
        }
    }

    function renderOverview(contest) {
        document.getElementById('contestDetailSection').innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h1 class="display-6 fw-bold mb-0">${contest.title}</h1>
                <span class="badge bg-${contest.type === 'online' ? 'primary' : 'warning text-dark'} fs-6 px-3 py-2 rounded-pill shadow-sm">
                    ${contest.type ? contest.type.toUpperCase() : 'UNKNOWN'}
                </span>
            </div>
            <p class="text-muted fs-5 mb-4">${contest.description || 'Chưa có mô tả chi tiết.'}</p>
        `;
        
        if (document.getElementById('likeCount')) {
            document.getElementById('likeCount').innerText = contest.like_rate || 0;
            document.getElementById('starRate').innerText = `${contest.star_rate || 0.0} / 5.0 ⭐`;
        }
    }

    function renderActionArea(contest) {
        const actionArea = document.getElementById('actionArea');
        if (!actionArea) return;

        if (contest.type === 'offline') {
            actionArea.innerHTML = `
                <div class="card p-5 text-center bg-light border-0 shadow-sm rounded-4">
                    <h4 class="fw-bold mb-3">Tham Gia Sự Kiện Offline</h4>
                    <p class="text-muted mb-4">Địa điểm dự kiến: <strong>${contest.location || 'Chưa cập nhật'}</strong></p>
                    ${isUserLoggedIn ? `<button id="btnRegisterOffline" class="btn btn-dark btn-lg px-5 rounded-pill shadow-sm">Đăng Ký Tham Gia</button>` : `<a href="/login" class="btn btn-outline-dark btn-lg px-5 rounded-pill">Đăng nhập để đăng ký</a>`}
                </div>
            `;
        } else {
            document.getElementById('submissionsSection')?.classList.remove('d-none');
            // Giao diện Online
            actionArea.innerHTML = `
                <div class="alert alert-info border-0 rounded-4 shadow-sm p-4">
                    <h5 class="fw-bold mb-2">Cuộc thi Online</h5>
                    <p class="mb-0">Kéo xuống để xem các bài dự thi hoặc gửi bài của bạn!</p>
                </div>
            `;
        }
    }

    function renderComments(comments) {
        const container = document.getElementById('commentList');
        if (!container) return;
        
        if (!comments || comments.length === 0) {
            container.innerHTML = '<div class="text-muted bg-light p-3 rounded-3">Chưa có bình luận nào.</div>';
            return;
        }
        container.innerHTML = comments.map(c => `
            <div class="p-3 bg-light rounded-4 mb-2">
                <strong class="text-dark">@${c.author?.username || 'AnDanh'}</strong>
                <p class="mb-0 text-muted mt-1">${c.content}</p>
            </div>
        `).join('');
    }

    loadContestDetail();
});