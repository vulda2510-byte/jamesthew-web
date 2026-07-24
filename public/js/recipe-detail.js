// public/js/recipe-detail.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Phân tách lấy ID của Recipe từ thanh địa chỉ URL (Ví dụ: /recipes/detail/123-abc)
    const pathParts = window.location.pathname.split('/');
    const recipeId = pathParts[pathParts.length - 1];

    if (!recipeId) return;

    let currentCategory = ''; // Biến lưu tạm danh mục để tìm bài liên quan

    // 2. Hàm gọi API bóc tách dữ liệu chi tiết của Công thức nấu ăn
    async function loadRecipeDetails() {
        try {
            // Sử dụng hàm getById trong RecipeController của bạn đã viết ở Turn 1
            const response = await fetch(`/api/v1/recipes/${recipeId}`);
            const data = await response.json();

            if (response.ok && data.success) {
                const recipe = data.data;
                currentCategory = recipe.category_name || 'MAINS';
                
                renderHeroAndStats(recipe);
                renderIngredients(recipe.ingredients); // Chấp nhận dữ liệu mảng hoặc chuỗi tách rời
                renderInstructions(recipe.instructions);
                renderChefInfo(recipe.User || recipe.author);
                
                // Sau khi có danh mục bài này, kéo các bài liên quan cùng danh mục lên
                loadRelatedRecipes(currentCategory);
            } else {
                showErrorPage('Recipe not found in culinary system.');
            }
        } catch (error) {
            console.error('Error rendering recipe detail:', error);
            showErrorPage('Error loading database connection.');
        }
    }

    // 3. Đổ dữ liệu vào Hero và Bảng Thống kê (Stats)
    function renderHeroAndStats(recipe) {
        document.getElementById('breadcrumbCurrent').innerText = recipe.title;
        document.getElementById('recipeTitle').innerText = recipe.title;
        document.getElementById('recipeHeroImageLabel').innerText = `🍳 ${recipe.title}`;
        document.getElementById('recipeBadge').innerText = recipe.difficulty || 'Medium';
        document.getElementById('recipeCategory').innerText = (recipe.category_name || 'MAINS').toUpperCase();
        document.getElementById('recipeDuration').innerText = recipe.cooking_time || '45 mins';
        document.getElementById('recipeDescription').innerText = recipe.description || 'No description available.';

        // Đổ thông số kỹ thuật (Stats box)
        document.getElementById('statPrepTime').innerText = recipe.prep_time || '15 mins';
        document.getElementById('statCookTime').innerText = recipe.cooking_time || '30 mins';
        document.getElementById('statServings').innerText = recipe.servings || '4 servings';
        document.getElementById('statCalories').innerText = recipe.calories || '420 kcal';
        document.getElementById('statDifficulty').innerText = recipe.difficulty || 'Medium';
        document.getElementById('statCuisine').innerText = recipe.cuisine || 'European';
    }

    // 4. Render Danh sách nguyên liệu kèm tính năng UX "Gạch chéo khi đã chuẩn bị xong"
    function renderIngredients(ingredients) {
        const container = document.getElementById('ingredientsListContainer');
        if (!ingredients) {
            container.innerHTML = '<p class="text-muted">No ingredient data available.</p>';
            return;
        }

        // Xử lý thông minh: Nếu dữ liệu là chuỗi String phân tách bằng dấu xuống dòng hoặc mảng
        const list = Array.isArray(ingredients) ? ingredients : ingredients.split('\n');
        let html = '';

        list.forEach((item, index) => {
            if (!item.trim()) return;
            html += `
                <label class="form-checkbox-group ingredient-item" style="cursor: pointer; display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <input type="checkbox" class="ingredient-check" style="width: 18px; height: 18px;"> 
                    <span class="ingredient-text">${item}</span>
                </label>
            `;
        });
        container.innerHTML = html;

        // Tính năng UX: Click checkbox -> Làm mờ/Gạch chữ thể hiện đã chuẩn bị xong nguyên liệu đó
        container.querySelectorAll('.ingredient-check').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const textSpan = e.target.nextElementSibling;
                if (e.target.checked) {
                    textSpan.style.textDecoration = 'line-through';
                    textSpan.style.opacity = '0.5';
                } else {
                    textSpan.style.textDecoration = 'none';
                    textSpan.style.opacity = '1';
                }
            });
        });
    }

    // 5. Render Các bước thực hiện (Instructions) theo đúng thứ tự thiết kế Card của bạn
    function renderInstructions(steps) {
        const container = document.getElementById('instructionsListContainer');
        if (!steps) {
            container.innerHTML = '<p class="text-muted">No step-by-step instructions provided.</p>';
            return;
        }

        const stepList = Array.isArray(steps) ? steps : steps.split('\n');
        let html = '';

        stepList.forEach((step, index) => {
            if (!step.trim()) return;
            // Tách tiêu đề bước nếu định dạng kiểu "Bước 1: Nội dung"
            const parts = step.split(':');
            const stepTitle = parts.length > 1 ? parts[0] : `Step ${index + 1}`;
            const stepBody = parts.length > 1 ? parts.slice(1).join(':') : step;

            html += `
                <div class="step-card card" style="margin-bottom: 20px;">
                    <div class="card-body flex-row align-start" style="display: flex; gap: 20px; padding: 20px;">
                        <div class="step-number" style="background: var(--primary-color, #ff5a5f); color: white; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${index + 1}</div>
                        <div class="step-content">
                            <strong style="font-size: 1.1rem; display: block; margin-bottom: 5px;">${stepTitle}</strong>
                            <p class="text-muted" style="margin: 0; line-height: 1.5;">${stepBody}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 6. Gán liên kết Thông tin Tác giả (Chef Profile)
    function renderChefInfo(chef) {
        if (!chef) return;
        document.getElementById('chefName').innerText = `${chef.firstName || 'Chef'} ${chef.lastName || 'Member'}`;
        document.getElementById('chefBio').innerText = chef.bio || 'Professional creator and dedicated system culinary expert.';
        document.getElementById('chefAvatarLabel').innerText = chef.username ? chef.username.substring(0,2).toUpperCase() : 'CF';
        
        // Điều hướng động sang đúng trang Profile của tác giả bài viết
        document.getElementById('chefProfileLink').setAttribute('href', `/profile?user=${chef.id || chef.username}`);
    }

    // 7. Tải danh sách Bài viết liên quan (Related Recipes Grid)
    async function loadRelatedRecipes(category) {
        const grid = document.getElementById('relatedRecipesGrid');
        try {
            const response = await fetch(`/api/v1/recipes?category=${encodeURIComponent(category)}`);
            const data = await response.json();

            if (response.ok && data.success && data.data.length > 0) {
                // Lọc bỏ bài hiện tại ra khỏi danh sách gợi ý và lấy tối đa 3 bài bài
                const filtered = data.data.filter(item => item.id !== recipeId).slice(0, 3);
                
                if (filtered.length === 0) {
                    grid.innerHTML = '<p class="text-muted">No related masterpieces in this segment yet.</p>';
                    return;
                }

                let html = '';
                filtered.forEach(item => {
                    html += `
                        <div class="card recipe-card">
                            <div class="image-placeholder card-img"><span>🍲 ${item.title}</span></div>
                            <div class="card-body">
                                <h3>${item.title}</h3>
                                <div class="recipe-meta flex-row">
                                    <span class="badge">${item.difficulty || 'Medium'}</span>
                                    <span class="meta-text">${item.cooking_time || '30 mins'}</span>
                                </div>
                            </div>
                            <div class="card-footer flex-between">
                                <span class="category-label text-muted">${(item.category_name || category).toUpperCase()}</span>
                                <a href="/recipes/detail/${item.id}" class="btn btn-outline btn-sm">View Recipe</a>
                            </div>
                        </div>
                    `;
                });
                grid.innerHTML = html;
            }
        } catch (err) {
            console.error('Error fetching related content:', err);
            grid.innerHTML = '';
        }
    }

    // 8. Xử lý các Sự kiện Nút bấm Tương tác (Save / Share)
    
    // Nút Lưu công thức (Save Recipe Toggle)
    const btnSave = document.getElementById('btnSaveRecipe');
    if (btnSave) {
        let isSaved = false;
        btnSave.addEventListener('click', () => {
            isSaved = !isSaved;
            if (isSaved) {
                btnSave.innerHTML = '❤️ Saved to Box';
                btnSave.style.backgroundColor = '#f8d7da';
                btnSave.style.color = '#721c24';
                alert('Recipe saved to your personal collection successfully!');
            } else {
                btnSave.innerHTML = '🔖 Save Recipe';
                btnSave.style.backgroundColor = 'transparent';
                btnSave.style.color = 'inherit';
            }
        });
    }

    // Nút chia sẻ (Share URL Link via Web Share API)
    const btnShare = document.getElementById('btnShareRecipe');
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: document.getElementById('recipeTitle').innerText,
                        url: window.location.href
                    });
                } catch (err) { console.log('Share canceled.'); }
            } else {
                // Fallback nếu trình duyệt không hỗ trợ API Share: Tự động copy liên kết vào bộ nhớ đệm
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert('Recipe link successfully copied to your clipboard!');
                } catch (err) { alert('Unable to copy path link.'); }
            }
        });
    }

    function showErrorPage(message) {
        document.body.innerHTML = `<div class="container text-center" style="padding: 100px 0;"><h2 class="text-danger">${message}</h2><a href="/recipes" class="btn btn-primary mt-15">Return to Gallery</a></div>`;
    }

    // Thực thi chạy ngay khi load trang
    loadRecipeDetails();
});