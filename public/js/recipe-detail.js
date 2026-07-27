// public/js/recipe-detail.js

document.addEventListener('DOMContentLoaded', () => {
    const pathParts = window.location.pathname.split('/');
    const recipeId = pathParts[pathParts.length - 1];

    if (!recipeId) return;

    let currentCategory = '';

    // Hàm chuẩn hóa đường dẫn URL ảnh
    function formatImageUrl(url) {
        if (!url) return null;
        url = url.trim();
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
            return url;
        }
        return '/' + url;
    }

    async function loadRecipeDetails() {
        try {
            const response = await fetch(`/api/v1/recipes/${recipeId}`);
            const data = await response.json();

            if (response.ok && data.success) {
                const recipe = data.data;
                currentCategory = recipe.category_name || recipe.category || 'MAINS';
                
                renderHeroAndStats(recipe);
                renderIngredients(recipe.ingredients);
                renderInstructions(recipe.instructions || recipe.steps || recipe.recipe_steps);
                renderChefInfo(recipe.User || recipe.author || recipe.user);
                
                loadRelatedRecipes(currentCategory);
            } else {
                showErrorPage('Recipe not found in culinary system.');
            }
        } catch (error) {
            console.error('Error rendering recipe detail:', error);
            showErrorPage('Error loading database connection.');
        }
    }

    function renderHeroAndStats(recipe) {
        // 1. Cập nhật Tiêu đề & Nội dung
        document.getElementById('breadcrumbCurrent').innerText = recipe.title || 'Recipe Detail';
        document.getElementById('recipeTitle').innerText = recipe.title || 'Untitled Recipe';
        document.getElementById('recipeBadge').innerText = recipe.difficulty || 'Medium';
        document.getElementById('recipeCategory').innerText = (recipe.category_name || recipe.category || 'MAINS').toUpperCase();
        document.getElementById('recipeDescription').innerText = recipe.description || 'No description available.';

        // 2. Xử lý hiển thị Ảnh chính (Hero Image)
        const imageBox = document.querySelector('.premium-image-box');
        const rawImgUrl = recipe.thumbnail_url || recipe.image_url || recipe.imageUrl || recipe.image;
        const formattedUrl = formatImageUrl(rawImgUrl);

        if (imageBox) {
            if (formattedUrl) {
                imageBox.innerHTML = `
                    <img src="${formattedUrl}" 
                         alt="${recipe.title}" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" 
                         onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'text-muted\\'>🍳 ${recipe.title}</span>';">
                `;
            } else {
                imageBox.innerHTML = `<span class="text-muted">🍳 ${recipe.title}</span>`;
            }
        }

        // 3. Xử lý thời gian & chỉ số (Đồng bộ với cột prep_time_minutes & cook_time_minutes trong DB)
        const prepMins = recipe.prep_time_minutes || recipe.prep_time || 0;
        const cookMins = recipe.cook_time_minutes || recipe.cooking_time || 0;
        const totalTime = (parseInt(prepMins) || 0) + (parseInt(cookMins) || 0);

        document.getElementById('recipeDuration').innerText = totalTime > 0 ? `${totalTime} mins` : '30 mins';
        document.getElementById('statPrepTime').innerText = prepMins ? `${prepMins} mins` : '--';
        document.getElementById('statCookTime').innerText = cookMins ? `${cookMins} mins` : '--';
        document.getElementById('statServings').innerText = recipe.servings ? `${recipe.servings} servings` : '--';
        document.getElementById('statCalories').innerText = recipe.calories ? `${recipe.calories} kcal` : 'N/A';
        document.getElementById('statDifficulty').innerText = recipe.difficulty || 'Medium';
        document.getElementById('statCuisine').innerText = recipe.cuisine || 'International';
    }

    function renderIngredients(ingredients) {
        const container = document.getElementById('ingredientsListContainer');
        if (!ingredients) {
            container.innerHTML = '<p class="text-muted text-center">No ingredient data available.</p>';
            return;
        }

        let list = [];
        if (Array.isArray(ingredients)) {
            list = ingredients.map(ing => typeof ing === 'object' ? (ing.name || ing.ingredient_name || JSON.stringify(ing)) : ing);
        } else if (typeof ingredients === 'string') {
            list = ingredients.split('\n');
        }

        let html = '';
        list.forEach((item) => {
            if (!item || !item.trim()) return;
            html += `
                <label class="form-checkbox-group ingredient-item" style="cursor: pointer; display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <input type="checkbox" class="ingredient-check" style="width: 18px; height: 18px;"> 
                    <span class="ingredient-text">${item.trim()}</span>
                </label>
            `;
        });

        container.innerHTML = html || '<p class="text-muted text-center">No ingredient data available.</p>';

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

    function renderInstructions(steps) {
        const container = document.getElementById('instructionsListContainer');
        if (!steps) {
            container.innerHTML = '<p class="text-muted text-center">No step-by-step instructions provided.</p>';
            return;
        }

        let stepList = [];
        if (Array.isArray(steps)) {
            stepList = steps.map(s => typeof s === 'object' ? (s.instruction || s.description || s.step_instruction) : s);
        } else if (typeof steps === 'string') {
            stepList = steps.split('\n');
        }

        let html = '';
        stepList.forEach((step, index) => {
            if (!step || !step.trim()) return;
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

        container.innerHTML = html || '<p class="text-muted text-center">No instructions provided.</p>';
    }

    function renderChefInfo(chef) {
        if (!chef) return;
        const firstName = chef.firstName || chef.first_name || 'Chef';
        const lastName = chef.lastName || chef.last_name || 'Member';
        const username = chef.username || 'chef';

        document.getElementById('chefName').innerText = `${firstName} ${lastName}`;
        document.getElementById('chefBio').innerText = chef.bio || 'Professional creator and dedicated system culinary expert.';
        document.getElementById('chefAvatarLabel').innerText = username.substring(0, 2).toUpperCase();
        document.getElementById('chefProfileLink').setAttribute('href', `/profile?user=${chef.id || username}`);
    }

    async function loadRelatedRecipes(category) {
        const grid = document.getElementById('relatedRecipesGrid');
        if (!grid) return;

        try {
            const response = await fetch(`/api/v1/recipes?category=${encodeURIComponent(category)}`);
            const data = await response.json();

            if (response.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
                const filtered = data.data.filter(item => String(item.id) !== String(recipeId)).slice(0, 3);
                
                if (filtered.length === 0) {
                    grid.innerHTML = '<p class="text-muted text-center" style="grid-column: 1 / -1;">No related masterpieces in this category yet.</p>';
                    return;
                }

                let html = '';
                filtered.forEach(item => {
                    const imgUrl = formatImageUrl(item.thumbnail_url || item.image_url || item.image);
                    const cookTime = (item.cook_time_minutes || item.cooking_time || 30) + ' mins';
                    
                    const imgHtml = imgUrl 
                        ? `<img src="${imgUrl}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<span>🍲 ${item.title}</span>';">`
                        : `<span>🍲 ${item.title}</span>`;

                    html += `
                        <div class="card recipe-card">
                            <div class="image-placeholder card-img">${imgHtml}</div>
                            <div class="card-body">
                                <h3>${item.title}</h3>
                                <div class="recipe-meta flex-row mt-10">
                                    <span class="badge">${item.difficulty || 'Medium'}</span>
                                    <span class="meta-text">${cookTime}</span>
                                </div>
                            </div>
                            <div class="card-footer flex-between mt-15">
                                <span class="category-label text-muted">${(item.category_name || category).toUpperCase()}</span>
                                <a href="/recipes/detail/${item.id}" class="btn btn-outline btn-sm">View Recipe</a>
                            </div>
                        </div>
                    `;
                });
                grid.innerHTML = html;
            } else {
                grid.innerHTML = '<p class="text-muted text-center" style="grid-column: 1 / -1;">No related recipes found.</p>';
            }
        } catch (err) {
            console.error('Error fetching related content:', err);
            grid.innerHTML = '';
        }
    }

    // Xử lý Sự kiện Nút Lưu & Chia sẻ
    const btnSave = document.getElementById('btnSaveRecipe');
    if (btnSave) {
        let isSaved = false;
        btnSave.addEventListener('click', () => {
            isSaved = !isSaved;
            if (isSaved) {
                btnSave.innerHTML = '❤️ Saved to Box';
                btnSave.style.backgroundColor = '#f8d7da';
                btnSave.style.color = '#721c24';
                if (typeof AppNotify !== 'undefined') AppNotify.success('Recipe saved to your personal collection successfully!', 'COLLECTION');
            } else {
                btnSave.innerHTML = '🔖 Save Recipe';
                btnSave.style.backgroundColor = 'transparent';
                btnSave.style.color = 'inherit';
                if (typeof AppNotify !== 'undefined') AppNotify.info('Recipe removed from your saved box.', 'COLLECTION');
            }
        });
    }

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
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    if (typeof AppNotify !== 'undefined') AppNotify.success('Recipe link copied to clipboard!', 'SHARE LINK');
                } catch (err) { 
                    if (typeof AppNotify !== 'undefined') AppNotify.error('Unable to copy path link.', 'SHARE ERROR'); 
                }
            }
        });
    }

    function showErrorPage(message) {
        document.body.innerHTML = `
            <div class="container text-center" style="padding: 100px 0;">
                <h2 class="text-danger">${message}</h2>
                <a href="/recipes" class="btn btn-primary mt-15">Return to Gallery</a>
            </div>`;
    }

    loadRecipeDetails();
});