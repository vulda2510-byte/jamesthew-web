// public/js/recipes.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Quản lý trạng thái bộ lọc toàn cục của trang
    const state = {
        search: '',
        category: 'ALL',
        difficulty: '',
        sort: 'newest',
        page: 1,
        limit: 6 // Mỗi trang hiển thị 6 bài viết theo thiết kế mẫu
    };

    // Khai báo các Element cần tương tác
    const searchInput = document.getElementById('recipeSearchInput');
    const categoryButtons = document.querySelectorAll('.category-pill');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const sortFilter = document.getElementById('sortFilter');
    const gridContainer = document.getElementById('recipesGridContainer');
    const paginationWrapper = document.getElementById('paginationWrapper');

    // Đọc tham số `?search=` từ URL nếu người dùng chuyển sang từ trang chủ
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
        state.search = urlParams.get('search');
        if (searchInput) searchInput.value = state.search;
    }

    // 2. Hàm Fetch dữ liệu từ API dựa trên trạng thái (Filter + Pagination)
    async function fetchFilteredRecipes() {
        gridContainer.innerHTML = '<p class="text-muted text-center" style="grid-column: 1/-1;">Updating gallery list...</p>';
        
        // Xây dựng Query Parameters động gửi lên API Backend
        const queryParams = new URLSearchParams({
            page: state.page,
            limit: state.limit,
            search: state.search,
            category: state.category !== 'ALL' ? state.category : '',
            difficulty: state.difficulty,
            sort: state.sort
        });

        try {
            const response = await fetch(`/api/v1/recipes?${queryParams.toString()}`);
            const data = await response.json();

            if (response.ok && data.success && data.data && data.data.length > 0) {
                renderRecipeGrid(data.data);
                renderPagination(data.pagination || { totalPages: 1, currentPage: 1 });
            } else {
                gridContainer.innerHTML = `
                    <div class="text-center" style="grid-column: 1/-1; padding: 40px 0;">
                        <p class="text-muted text-lg">No recipes match your current filtering criteria.</p>
                    </div>
                `;
                if (paginationWrapper) paginationWrapper.innerHTML = '';
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            gridContainer.innerHTML = '<p class="text-danger text-center" style="grid-column: 1/-1;">Error connecting to server database.</p>';
        }
    }

    // 3. Render lưới thẻ Card chi tiết, gán chính xác ID vào Link dẫn
    function renderRecipeGrid(recipes) {
        let html = '';
        recipes.forEach(recipe => {
            const difficulty = recipe.difficulty || 'Medium';
            const duration = recipe.cooking_time || '30 mins';
            const categoryName = recipe.category_name || 'GENERAL';
            
            // Xử lý logic hiển thị ảnh mượt mà giống trang chủ
            const imageHtml = recipe.image 
                ? `<img src="${recipe.image}" alt="${recipe.title}">` 
                : `<span>📸 ${recipe.title}</span>`;

            html += `
                <div class="card recipe-card">
                    <a href="/recipes/detail/${recipe.id}" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; flex-grow: 1;">
                        <div class="card-img">
                            ${imageHtml}
                        </div>
                        <div class="card-body">
                            <h3>${recipe.title}</h3>
                            <p>${recipe.description ? recipe.description.substring(0, 90) + '...' : 'Premium curated culinary guide.'}</p>
                            <div class="recipe-meta flex-row">
                                <span class="badge">${difficulty}</span>
                                <span class="meta-text">⏱️ ${duration}</span>
                            </div>
                        </div>
                    </a>
                    <div class="card-footer flex-between">
                        <span class="category-label">${categoryName.toUpperCase()}</span>
                        <a href="/recipes/detail/${recipe.id}" class="text-link text-sm">VIEW RECIPE</a>
                    </div>
                </div>
            `;
        });
        gridContainer.innerHTML = html;
    }
    // 4. Khởi dựng hệ thống Phân trang Động (Pagination)
    function renderPagination(pagination) {
        const { totalPages, currentPage } = pagination;
        if (totalPages <= 1) {
            paginationWrapper.innerHTML = '';
            return;
        }

        let html = '<ul class="pagination flex-row">';
        
        // Nút Previous
        html += `<li><a href="#" class="btn btn-outline btn-sm ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">Previous</a></li>`;

        // Các nút số trang cụ thể
        for (let i = 1; i <= totalPages; i++) {
            html += `<li><a href="#" class="btn ${i === currentPage ? 'btn-primary' : 'btn-outline'} btn-sm" data-page="${i}">${i}</a></li>`;
        }

        // Nút Next
        html += `<li><a href="#" class="btn btn-outline btn-sm ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">Next</a></li>`;
        
        html += '</ul>';
        paginationWrapper.innerHTML = html;

        // Bắt sự kiện chuyển trang cho các thẻ `a` vừa vẽ
        paginationWrapper.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = parseInt(link.getAttribute('data-page'));
                if (targetPage && targetPage !== state.page && targetPage >= 1 && targetPage <= totalPages) {
                    state.page = targetPage;
                    fetchFilteredRecipes();
                    window.scrollTo({ top: 200, behavior: 'smooth' }); // Cuộn nhẹ màn hình lên đầu danh sách để tăng UX
                }
            });
        });
    }

    // 5. Gắn Bộ lắng nghe Sự kiện (Event Listeners) cho các bộ lọc
    
    // Tìm kiếm với tính năng Debounce (Chờ người dùng gõ xong 400ms mới gọi API để tránh spam request)
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            state.search = e.target.value.trim();
            state.page = 1; // Reset về trang 1 khi lọc
            searchTimeout = setTimeout(fetchFilteredRecipes, 400);
        });
    }

    // Lọc theo Danh mục (Categories Pill Toggle)
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline');
            });
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary', 'active');

            state.category = btn.getAttribute('data-category');
            state.page = 1;
            fetchFilteredRecipes();
        });
    });

    // Lọc theo Độ khó
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', (e) => {
            state.difficulty = e.target.value;
            state.page = 1;
            fetchFilteredRecipes();
        });
    }

    // Lọc theo Cơ chế Sắp xếp
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            state.sort = e.target.value;
            state.page = 1;
            fetchFilteredRecipes();
        });
    }

    // Chạy tải dữ liệu lần đầu tiên khi mở trang
    fetchFilteredRecipes();
});