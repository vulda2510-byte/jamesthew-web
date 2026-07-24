// public/js/home.js

document.addEventListener('DOMContentLoaded', () => {
    // Khai báo các container để render data
    const featuredContainer = document.getElementById('featuredRecipesContainer');
    const latestContainer = document.getElementById('latestRecipesContainer');
    const searchForm = document.getElementById('searchForm');

    // 1. Tải danh sách bài viết động từ API Backend
    async function loadHomeContent() {
        try {
            // Gọi API lấy toàn bộ recipes (Sử dụng hàm getAll trong RecipeController của bạn)
            const response = await fetch('/api/v1/recipes');
            const data = await response.json();

            if (response.ok && data.success && data.data.length > 0) {
                const recipes = data.data;

                // Tách lấy bài nổi bật (Giả lập 3 bài đầu) và bài mới nhất
                const featuredItems = recipes.slice(0, 3);
                const latestItems = recipes.slice(0, 4); // Lấy tối đa 4 bài mới

                renderFeaturedRecipes(featuredItems);
                renderLatestRecipes(latestItems);
            } else {
                showEmptyStates();
            }
        } catch (error) {
            console.error('Error fetching recipes for Home:', error);
            showErrorStates();
        }
    }

    // 2. Render phân mục Nổi bật (Giữ nguyên cấu trúc Asymmetric Grid 1 lớn + 2 nhỏ của bạn)
// Thay thế hoặc cập nhật hàm render Featured Recipes trong public/js/home.js
function renderFeaturedRecipes(recipes) {
    const container = document.getElementById('featuredRecipesContainer');
    if (!recipes || recipes.length < 3) return;

    // Lấy 3 công thức đầu tiên
    const mainRecipe = recipes[0];
    const sub1 = recipes[1];
    const sub2 = recipes[2];

    // Bơm dữ liệu động vào đúng UI bạn thiết kế
    const html = `
        <div class="featured-grid">
            <!-- Cột trái lớn -->
            <a href="/recipes/detail/${mainRecipe.id}" class="card card-large">
                <div class="card-img">
                    ${mainRecipe.image 
                        ? `<img src="${mainRecipe.image}" alt="${mainRecipe.title}">` 
                        : `<span>🍳 ${mainRecipe.title}</span>`}
                </div>
                <div class="card-body">
                    <h3>${mainRecipe.title}</h3>
                    <p class="text-muted">${mainRecipe.description || 'A masterpiece of culinary art.'}</p>
                </div>
            </a>

            <!-- Cột phải 2 card nhỏ -->
            <div class="featured-right">
                <a href="/recipes/detail/${sub1.id}" class="card card-small">
                    <div class="card-img">
                        ${sub1.image 
                            ? `<img src="${sub1.image}" alt="${sub1.title}">` 
                            : `<span>🥩 ${sub1.title}</span>`}
                    </div>
                    <div class="card-body">
                        <h3>${sub1.title}</h3>
                        <p class="text-muted">${sub1.description || 'Tender and incredibly delicious.'}</p>
                    </div>
                </a>
                
                <a href="/recipes/detail/${sub2.id}" class="card card-small">
                    <div class="card-img">
                        ${sub2.image 
                            ? `<img src="${sub2.image}" alt="${sub2.title}">` 
                            : `<span>🥣 ${sub2.title}</span>`}
                    </div>
                    <div class="card-body">
                        <h3>${sub2.title}</h3>
                        <p class="text-muted">${sub2.description || 'A comforting classic.'}</p>
                    </div>
                </a>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Cập nhật luôn hàm render Latest Recipes cho đồng bộ UI (3 cột bằng nhau)
function renderLatestRecipes(recipes) {
    const container = document.getElementById('latestRecipesContainer');
    if (!recipes || recipes.length === 0) return;

    let html = '<div class="latest-grid">';
    
    // Lặp qua dữ liệu và nhúng vào thẻ card-small
    recipes.slice(0, 3).forEach(recipe => {
        html += `
            <a href="/recipes/detail/${recipe.id}" class="card card-small">
                <div class="card-img">
                    ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}">` : `<span>🍽️ ${recipe.title}</span>`}
                </div>
                <div class="card-body">
                    <h3>${recipe.title}</h3>
                    <p class="text-muted">${recipe.description || 'Freshly added to our collection.'}</p>
                </div>
            </a>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}
    // Xử lý các trạng thái lỗi hoặc trống dữ liệu
    function showEmptyStates() {
        const msg = '<p class="text-muted">No recipes found. Start creating your first masterpiece!</p>';
        if (featuredContainer) featuredContainer.innerHTML = msg;
        if (latestContainer) latestContainer.innerHTML = msg;
    }

    function showErrorStates() {
        const msg = '<p class="text-danger">Failed to connect to culinary database. Please try again later.</p>';
        if (featuredContainer) featuredContainer.innerHTML = msg;
        if (latestContainer) latestContainer.innerHTML = msg;
    }

    // 4. Xử lý bộ lọc Tìm kiếm (Search Feature)
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keyword = document.getElementById('searchInput').value.trim();
            if (keyword) {
                // Điều hướng người dùng sang trang danh sách kèm theo tham số query search
                window.location.href = `/recipes?search=${encodeURIComponent(keyword)}`;
            }
        });
    }

    // Kích hoạt chạy ngay khi load trang chủ
    loadHomeContent();
});