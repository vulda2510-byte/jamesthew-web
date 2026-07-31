document.addEventListener("DOMContentLoaded", () => {
    initContestListPage();
});

let globalContestsData = [];

async function initContestListPage() {
    const grid = document.getElementById("allContestsGrid");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const difficultyFilter = document.getElementById("difficultyFilter");

    try {
        const response = await fetch("/api/v1/contests");
        if (!response.ok) throw new Error("Failed to fetch contests.");

        const result = await response.json();
        globalContestsData = result.data || (Array.isArray(result) ? result : []);

        renderContestsGrid(grid, globalContestsData);

        // Bộ lọc dữ liệu
        const handleFilter = () => {
            const keyword = searchInput.value.toLowerCase().trim();
            const status = statusFilter.value;
            const difficulty = difficultyFilter.value;

            const filtered = globalContestsData.filter(contest => {
                const matchesKeyword = (contest.title && contest.title.toLowerCase().includes(keyword)) ||
                                       (contest.description && contest.description.toLowerCase().includes(keyword));
                
                const matchesStatus = status === 'all' || (contest.status && contest.status.toLowerCase() === status.toLowerCase());
                const matchesDiff = difficulty === 'all' || (contest.difficulty && contest.difficulty.toLowerCase() === difficulty.toLowerCase());

                return matchesKeyword && matchesStatus && matchesDiff;
            });

            renderContestsGrid(grid, filtered);
        };

        searchInput.addEventListener("input", handleFilter);
        statusFilter.addEventListener("change", handleFilter);
        difficultyFilter.addEventListener("change", handleFilter);

    } catch (error) {
        console.error("Error loading contest list:", error);
        if (grid) {
            grid.innerHTML = `
                <div class="text-center w-100 py-5" style="grid-column: 1 / -1;">
                    <p class="text-muted">Unable to load contest directory. Please try again later.</p>
                </div>`;
        }
    }
}

function renderContestsGrid(container, list) {
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="text-center w-100 py-5" style="grid-column: 1 / -1;">
                <p style="color: #000000; font-weight: 700;">No competitions match your selected criteria.</p>
            </div>`;
        return;
    }

    container.innerHTML = list.map(contest => {
        const deadline = contest.end_date 
            ? new Date(contest.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "TBA";

        const imgHtml = contest.image_url 
            ? `<img src="${contest.image_url}" alt="${contest.title}">`
            : `<span>🍲 ${contest.title}</span>`;

        const desc = contest.description 
            ? (contest.description.length > 75 ? contest.description.substring(0, 75) + '...' : contest.description)
            : 'No description provided.';

        const statusClass = (contest.status || 'upcoming').toLowerCase();

        return `
            <div class="contest-card-luxury">
                <div class="card-img">
                    ${imgHtml}
                    <span class="status-tag ${statusClass}">${(contest.status || 'Upcoming').toUpperCase()}</span>
                </div>
                <div class="card-body">
                    <h3>${contest.title}</h3>
                    <p class="card-desc">${desc}</p>
                    
                    <div class="recipe-meta-row">
                        <span class="badge-black">${contest.difficulty || 'Medium'}</span>
                        <span class="meta-gold-text">Prize: ${contest.prize_details || contest.prize || 'TBA'}</span>
                    </div>
                    
                    <p class="deadline-info">
                        <strong>Deadline:</strong> ${deadline}
                    </p>
                </div>
                <div class="card-footer">
                    <a href="/contests/detail/${contest.id}" class="btn-black-solid">Join</a>
                    <a href="/contests/detail/${contest.id}" class="btn-black-outline">Details</a>
                </div>
            </div>
        `;
    }).join("");
}