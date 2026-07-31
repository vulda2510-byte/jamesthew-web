// public/js/home.js

document.addEventListener('DOMContentLoaded', () => {
    // Khai báo các container để render data
    const featuredContainer = document.getElementById('featuredRecipesContainer');
    const latestContainer = document.getElementById('latestRecipesContainer');
    const searchForm = document.getElementById('searchForm');

    // 1. Hàm hỗ trợ trích xuất đường dẫn ảnh an toàn từ nhiều trường dữ liệu khác nhau
    function getRecipeImage(recipe) {
        if (!recipe) return null;
        return recipe.thumbnail_url || recipe.thumbnailUrl || recipe.image_url || recipe.image || null;
    }

    // 2. Hàm tạo HTML hiển thị ảnh có xử lý bắt lỗi 404 (onerror) chuẩn mẫu trang Recipes
    function renderCardImageHtml(recipe, defaultEmoji = '🍳') {
        const imageUrl = getRecipeImage(recipe);
        if (imageUrl) {
            return `<img src="${imageUrl}" alt="${recipe.title}" onerror="this.onerror=null; this.parentElement.innerHTML='<span>${defaultEmoji} ${recipe.title}</span>';">`;
        }
        return `<span>${defaultEmoji} ${recipe.title}</span>`;
    }

    // 3. Tải danh sách bài viết động từ API Backend
    async function loadHomeContent() {
        try {
            const response = await fetch('/api/v1/recipes');
            const data = await response.json();

            // Đọc dữ liệu linh hoạt (hỗ trợ cả data.data và mảng trực tiếp)
            const recipes = data.data?.recipes || data.data || (Array.isArray(data) ? data : []);

            if (response.ok && recipes.length > 0) {
                renderFeaturedRecipes(recipes);
                renderLatestRecipes(recipes);
            } else {
                showEmptyStates();
            }
        } catch (error) {
            console.error('Error fetching recipes for Home:', error);
            showErrorStates();
        }
    }

    // 4. Render phân mục Nổi bật (Featured Masterpieces)
    function renderFeaturedRecipes(recipes) {
        if (!featuredContainer) return;
        if (!recipes || recipes.length === 0) {
            showEmptyStates();
            return;
        }

        // Lấy bài viết (dự phòng nếu chưa đủ 3 bài)
        const mainRecipe = recipes[0];
        const sub1 = recipes[1] || recipes[0];
        const sub2 = recipes[2] || recipes[0];

        const html = `
            <div class="featured-grid">
                <!-- Cột trái lớn -->
                <a href="/recipes/detail/${mainRecipe.id}" class="card card-large">
                    <div class="card-img">
                        ${renderCardImageHtml(mainRecipe, '🍳')}
                    </div>
                    <div class="card-body">
                        <h3>${mainRecipe.title}</h3>
                        <p class="text-muted">${mainRecipe.description ? mainRecipe.description.substring(0, 110) + '...' : 'A masterpiece of culinary art.'}</p>
                    </div>
                </a>

                <!-- Cột phải 2 card nhỏ -->
                <div class="featured-right">
                    <a href="/recipes/detail/${sub1.id}" class="card card-small">
                        <div class="card-img">
                            ${renderCardImageHtml(sub1, '🥩')}
                        </div>
                        <div class="card-body">
                            <h3>${sub1.title}</h3>
                            <p class="text-muted">${sub1.description ? sub1.description.substring(0, 70) + '...' : 'Tender and incredibly delicious.'}</p>
                        </div>
                    </a>
                    
                    <a href="/recipes/detail/${sub2.id}" class="card card-small">
                        <div class="card-img">
                            ${renderCardImageHtml(sub2, '🥣')}
                        </div>
                        <div class="card-body">
                            <h3>${sub2.title}</h3>
                            <p class="text-muted">${sub2.description ? sub2.description.substring(0, 70) + '...' : 'A comforting classic.'}</p>
                        </div>
                    </a>
                </div>
            </div>
        `;
        
        featuredContainer.innerHTML = html;
    }

    // 5. Render phân mục Mới nhất (Latest Recipes)
    function renderLatestRecipes(recipes) {
        if (!latestContainer) return;
        if (!recipes || recipes.length === 0) return;

        let html = '<div class="latest-grid">';
        
        recipes.slice(0, 3).forEach(recipe => {
            html += `
                <a href="/recipes/detail/${recipe.id}" class="card card-small">
                    <div class="card-img">
                        ${renderCardImageHtml(recipe, '🍽️')}
                    </div>
                    <div class="card-body">
                        <h3>${recipe.title}</h3>
                        <p class="text-muted">${recipe.description ? recipe.description.substring(0, 70) + '...' : 'Freshly added to our collection.'}</p>
                    </div>
                </a>
            `;
        });
        
        html += '</div>';
        latestContainer.innerHTML = html;
    }

    // Trạng thái trống / lỗi
    function showEmptyStates() {
        const msg = '<p class="text-muted text-center w-100">No recipes found. Start creating your first masterpiece!</p>';
        if (featuredContainer) featuredContainer.innerHTML = msg;
        if (latestContainer) latestContainer.innerHTML = msg;
    }

    function showErrorStates() {
        const msg = '<p class="text-danger text-center w-100">Failed to connect to culinary database. Please try again later.</p>';
        if (featuredContainer) featuredContainer.innerHTML = msg;
        if (latestContainer) latestContainer.innerHTML = msg;
    }

    // 6. Xử lý tìm kiếm
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            const keyword = searchInput ? searchInput.value.trim() : '';
            if (keyword) {
                window.location.href = `/recipes?search=${encodeURIComponent(keyword)}`;
            }
        });
    }

    // Tải dữ liệu khi mở trang
    loadHomeContent();
});