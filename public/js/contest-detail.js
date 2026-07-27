// public/js/contest-detail.js

document.addEventListener("DOMContentLoaded", () => {
    const contestDataSet = document.getElementById('contestData')?.dataset || {};
    
    const parts = window.location.pathname.split('/');
    const contestId = contestDataSet.contestId || parts[parts.length - 1]; 
    const isUserLoggedIn = contestDataSet.loggedIn === 'true';
    let currentRealContestId = null;

    async function loadContestDetail() {
        if (!contestId) {
            document.getElementById('contestDetailSection').innerHTML = '<p class="text-danger">Invalid Contest ID.</p>';
            return;
        }

        try {
            const res = await fetch(`/api/v1/contests/${contestId}`);
            const result = await res.json();

            if (result.success && result.data) {
                const contest = result.data;
                currentRealContestId = contest.id;
                
                renderOverview(contest);
                renderActionArea(contest);
                updateLikeUI(contest.totalLikes, contest.isLiked);
                renderComments(contest.comments);
            } else {
                document.getElementById('contestDetailSection').innerHTML = `<p class="text-muted">${result.message || 'Contest not found.'}</p>`;
            }
        } catch (error) {
            console.error("Error loading contest details:", error);
            document.getElementById('contestDetailSection').innerHTML = '<p class="text-muted">Error loading contest details.</p>';
        }
    }
   
    function updateLikeUI(totalLikes, isLiked) {
        const likeBtn = document.getElementById('likeBtn');
        const likeCountSpan = document.getElementById('likeCount');

        if (likeCountSpan) likeCountSpan.innerText = totalLikes || 0;

        if (likeBtn) {
            if (isLiked) {
                likeBtn.classList.add('active', 'btn-warning');
                likeBtn.classList.remove('btn-outline-warning');
            } else {
                likeBtn.classList.remove('active', 'btn-warning');
                likeBtn.classList.add('btn-outline-warning');
            }
        }
    }

    async function handleToggleLike() {
        const targetId = currentRealContestId || contestId;
        if (!targetId) return;

        try {
            const res = await fetch('/api/v1/contests/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_id: targetId, target_type: 'contest' })
            });

            const result = await res.json();
            if (result.success) {
                updateLikeUI(result.data.totalLikes, result.data.isLiked);
            } else {
                AppNotify.error(result.message || 'Unable to complete action.');
            }
        } catch (err) {
            console.error('Lỗi toggle like:', err);
            AppNotify.error('Network connection error.');
        }
    }

    function renderOverview(contest) {
        const typeClass = contest.type === 'offline' ? 'offline' : 'online';
        const startDate = contest.start_date ? new Date(contest.start_date).toLocaleDateString('en-US') : 'TBA';
        const endDate = contest.end_date ? new Date(contest.end_date).toLocaleDateString('en-US') : 'TBA';

        document.getElementById('contestDetailSection').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <h1 style="font-size: 2rem; font-weight: 800; margin: 0;">${contest.title}</h1>
                <span class="badge-type ${typeClass}">${(contest.type || 'ONLINE').toUpperCase()}</span>
            </div>
            <p class="text-muted" style="font-size: 1.05rem; line-height: 1.6;">${contest.description || 'No description available for this competition.'}</p>
            
            <div class="specs-grid">
                ${contest.type === 'offline' ? `
                    <div class="spec-item">
                        <span class="spec-label">Location</span>
                        <span class="spec-value">${contest.location || 'To be announced'}</span>
                    </div>
                ` : ''}
                <div class="spec-item">
                    <span class="spec-label">Timeline</span>
                    <span class="spec-value">${startDate} - ${endDate}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Rules Summary</span>
                    <span class="spec-value">${contest.rules || 'Standard culinary guidelines apply.'}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Prize Details</span>
                    <span class="spec-value">${contest.prize_details || 'Official Certificate & Cash Prize'}</span>
                </div>
            </div>
        `;

        const scoreElem = document.getElementById('starRate') || document.getElementById('scoreVal');
        if (scoreElem) {
            scoreElem.innerText = `SCORE: ${(contest.star_rate || 0.0).toFixed(1)} / 5.0`;
        }
    }

    function renderActionArea(contest) {
        const actionArea = document.getElementById('actionArea');
        if (!actionArea) return;

        if (contest.type === 'offline') {
            actionArea.innerHTML = `
                <div class="detail-card text-center">
                    <h2 class="section-title">JOIN OFFLINE EVENT</h2>
                    <p class="text-muted mb-20">Venue: <strong>${contest.location || 'To be updated'}</strong></p>
                    ${isUserLoggedIn 
                        ? `<button onclick="registerOffline()" class="btn btn-primary">Register Participation</button>` 
                        : `<a href="/login" class="btn btn-outline">Login to Register</a>`
                    }
                </div>
            `;
        } else {
            const subSec = document.getElementById('submissionsSection');
            if (subSec) subSec.classList.remove('d-none');

            actionArea.innerHTML = `
                <div class="detail-card">
                    <h2 class="section-title">SUBMIT YOUR ENTRY</h2>
                    ${isUserLoggedIn ? `
                        <form id="submissionForm" onsubmit="submitOnlineEntry(event)">
                            <div class="form-group">
                                <label class="form-label">Dish Title</label>
                                <input type="text" name="title" class="form-control" required placeholder="e.g. Signature Beef Wellington">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Image URL</label>
                                <input type="url" name="image_url" class="form-control" placeholder="https://example.com/dish.jpg">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Preparation & Recipe Description</label>
                                <textarea name="content" class="form-control" rows="4" required placeholder="Describe your culinary process and dish story..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit Entry</button>
                        </form>
                    ` : `
                        <div class="notice-box">
                            Please <a href="/login" class="link-gold">Login</a> to submit your competition entry.
                        </div>
                    `}
                </div>
            `;
            renderSubmissions(contest.submissions);
        }
    }

    function renderSubmissions(submissions) {
        const container = document.getElementById('submissionsList');
        if (!container) return;

        if (!submissions || submissions.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1;" class="notice-box text-center">No entries submitted yet. Be the first to enter!</div>';
            return;
        }

        container.innerHTML = submissions.map(s => `
            <div class="submission-card">
                <div class="submission-author">By @${s.user?.username || s.participant?.username || 'Chef'}</div>
                <div class="submission-img-wrapper">
                    ${s.image_url 
                        ? `<img src="${s.image_url}" alt="${s.title}">` 
                        : '<span>IMAGE PLACEHOLDER</span>'
                    }
                </div>
                <div class="submission-body">
                    <h3 class="submission-title">${s.title}</h3>
                    <p class="text-muted" style="font-size: 0.85rem; margin: 0;">${s.content ? s.content.substring(0, 70) + '...' : ''}</p>
                </div>
                ${s.judge_score > 0 ? `<div class="submission-score">Judge Score: ${s.judge_score}/10</div>` : ''}
            </div>
        `).join('');
    }

    function renderComments(comments) {
        const commentBox = document.getElementById('commentList');
        if (!commentBox) return;

        if (!comments || comments.length === 0) {
            commentBox.innerHTML = `
                <div class="text-center text-muted py-4">
                    No discussions yet. Start the conversation!
                </div>`;
            return;
        }
        commentBox.innerHTML = comments.map(c => `
            <div class="comment-item border-bottom py-3 text-start">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <strong class="text-warning" style="color: #d4af37;">@${c.author?.username || 'Anonymous'}</strong>
                    <small class="text-muted">${new Date(c.created_at || c.createdAt).toLocaleString('vi-VN')}</small>
                </div>
                <p class="mb-0 text-light">${c.content}</p>
            </div>
        `).join('');
    }

    // Handlers
    window.submitOnlineEntry = async function(e) {
        e.preventDefault();
        const targetId = currentRealContestId || contestId;
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch(`/api/v1/contests/${targetId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                AppNotify.success('Entry submitted successfully!', 'SUBMISSION');
                loadContestDetail();
            } else {
                AppNotify.error(result.message || 'Submission failed.');
            }
        } catch (err) {
            AppNotify.error('Error submitting entry. Please try again.');
        }
    };

    window.registerOffline = async function() {
        // Sử dụng Modal Confirm xác nhận trước khi đăng ký
        const isConfirmed = await AppNotify.confirm('Do you want to confirm your registration for this offline event?', 'EVENT REGISTRATION');
        if (!isConfirmed) return;

        const targetId = currentRealContestId || contestId;
        try {
            const res = await fetch(`/api/v1/contests/${targetId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Offline Event Registration' })
            });
            const result = await res.json();
            if (result.success) {
                AppNotify.success('Registration successful!', 'EVENT JOINED');
            } else {
                AppNotify.error(result.message || 'Registration failed.');
            }
        } catch (err) {
            AppNotify.error('Network error during registration.');
        }
    };

    document.getElementById('likeBtn')?.addEventListener('click', handleToggleLike);

    document.getElementById('commentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('commentInput').value;
        const targetId = currentRealContestId || contestId;

        try {
            const res = await fetch('/api/v1/contests/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_id: targetId, target_type: 'contest', content })
            });
            const result = await res.json();
            if (result.success) {
                document.getElementById('commentInput').value = '';
                loadContestDetail();
            } else {
                AppNotify.error(result.message || 'Failed to post comment.');
            }
        } catch (err) {
            AppNotify.error('Network error while posting comment.');
        }
    });

    loadContestDetail();
});