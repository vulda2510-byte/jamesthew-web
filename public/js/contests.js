document.addEventListener("DOMContentLoaded", () => {
    initContestsPage();
});

// 1. Hàm chuẩn hóa URL ảnh (Tránh lỗi 404 do thiếu dấu / ở đầu)
function formatImageUrl(url) {
    if (!url) return null;
    url = url.trim();
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
        return url;
    }
    return '/' + url;
}

// 2. Trích xuất URL ảnh (ĐÃ BỔ SUNG contest.banner_image CHUẨN THEO DATABASE)
function getContestImage(contest) {
    if (!contest) return null;
    const rawUrl = contest.banner_image || contest.image_url || contest.imageUrl || contest.banner_url || contest.thumbnail_url || contest.image || contest.cover_image || null;
    return formatImageUrl(rawUrl);
}

// 3. Render HTML ảnh an toàn
function renderContestImageHtml(contest, defaultEmoji = '🏆') {
    const imageUrl = getContestImage(contest);
    if (imageUrl) {
        return `<img src="${imageUrl}" alt="${contest.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<span>${defaultEmoji} ${contest.title}</span>';">`;
    }
    return `<span>${defaultEmoji} ${contest.title}</span>`;
}

/**
 * Khởi tạo dữ liệu trang Contests
 */
async function initContestsPage() {
    const featuredWrapper = document.getElementById("featuredContestWrapper");
    const upcomingGrid = document.getElementById("upcomingContestsGrid");

    try {
        const response = await fetch("/api/v1/contests");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const contestList = result.data || (Array.isArray(result) ? result : []);

        if (contestList.length > 0) {
            if (featuredWrapper) {
                const featured = contestList.find(c => c.is_featured || c.isFeatured) || contestList[0];
                renderFeaturedContest(featuredWrapper, featured);
            }

            if (upcomingGrid) {
                renderUpcomingContests(upcomingGrid, contestList);
            }
        } else {
            renderEmptyStates(featuredWrapper, upcomingGrid);
        }
    } catch (error) {
        console.error("Error loading contests data:", error);
        renderErrorStates(featuredWrapper, upcomingGrid);
    }
}

function renderFeaturedContest(container, contest) {
    if (!contest) {
        container.innerHTML = `
            <div class="notice-box text-center py-4">
                <p class="text-muted">No featured contest highlighted right now.</p>
            </div>`;
        return;
    }

    const imgHtml = renderContestImageHtml(contest, '🏆');

    const endDate = contest.end_date 
        ? new Date(contest.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
        : 'TBA';
        
    const startDate = contest.start_date 
        ? new Date(contest.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
        : 'TBA';

    container.innerHTML = `
        <div class="card featured-contest-card">
            <div class="image-placeholder featured-img">${imgHtml}</div>
            <div class="card-body p-40">
                <h3>${contest.title}</h3>
                <p class="text-muted mt-15">${contest.description || 'No description available.'}</p>
                <ul class="contest-details mt-15">
                    <li><strong>Deadline:</strong> ${endDate}</li>
                    <li><strong>Event Date:</strong> ${startDate}</li>
                    <li><strong>Prize:</strong> ${contest.prize_details || contest.prize || 'Official Certificate & Cash Prize'}</li>
                </ul>
                <div class="mt-15">
                    <a href="/contests/detail/${contest.id}" class="btn btn-primary">View & Join Contest</a>
                </div>
            </div>
        </div>
    `;
}

function renderUpcomingContests(container, contests) {
    container.innerHTML = contests.map(contest => {
        const deadline = contest.end_date 
            ? new Date(contest.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "TBA";
        
        const imgHtml = renderContestImageHtml(contest, '🍲');

        const desc = contest.description 
            ? (contest.description.length > 80 ? contest.description.substring(0, 80) + '...' : contest.description) 
            : 'No description provided.';

        return `
            <div class="card contest-card">
                <div class="image-placeholder card-img">${imgHtml}</div>
                <div class="card-body">
                    <h3>${contest.title}</h3>
                    <p class="text-muted">${desc}</p>
                    <div class="recipe-meta flex-row mt-15">
                        <span class="badge">${contest.difficulty || 'Medium'}</span>
                        <span class="meta-text font-bold">Prize: ${contest.prize_details || contest.prize || 'TBA'}</span>
                    </div>
                    <p class="text-sm mt-15"><strong>Deadline:</strong> ${deadline}</p>
                </div>
                <div class="card-footer flex-between">
                    <a href="/contests/detail/${contest.id}" class="btn btn-primary btn-sm">Join</a>
                    <a href="/contests/detail/${contest.id}" class="btn btn-outline btn-sm">Details</a>
                </div>
            </div>
        `;
    }).join("");
}

function renderEmptyStates(featuredWrapper, upcomingGrid) {
    if (featuredWrapper) {
        featuredWrapper.innerHTML = `
            <div class="notice-box text-center py-4">
                <p class="text-muted">No featured contest highlighted right now.</p>
            </div>`;
    }
    if (upcomingGrid) {
        upcomingGrid.innerHTML = `
            <div class="text-center w-100 py-5" style="grid-column: 1 / -1;">
                <p class="text-muted">No upcoming contests found at this time.</p>
            </div>`;
    }
}

function renderErrorStates(featuredWrapper, upcomingGrid) {
    if (featuredWrapper) {
        featuredWrapper.innerHTML = `
            <div class="notice-box text-center py-4">
                <p class="text-muted">Unable to load featured contest.</p>
            </div>`;
    }
    if (upcomingGrid) {
        upcomingGrid.innerHTML = `
            <div class="text-center w-100 py-5" style="grid-column: 1 / -1;">
                <p class="text-muted">Unable to load upcoming contests.</p>
            </div>`;
    }
}