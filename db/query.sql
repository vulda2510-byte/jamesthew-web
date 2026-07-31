
DROP DATABASE IF EXISTS jamesthew;
CREATE DATABASE jamesthew CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `daily_limits` 
ADD COLUMN `action_date` DATE NULL AFTER `action_type`;
-- Xóa dữ liệu cũ (nếu có) để tránh lỗi trùng lặp
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `recipe_categories`;
TRUNCATE TABLE `categories`;
TRUNCATE TABLE `tags`;

-- Thêm Categories (Dành cho bộ lọc trang Recipes)
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `parent_id`, `display_order`, `created_at`, `updated_at`) VALUES
('cat-11111111-1111-1111-1111-111111111111', 'Appetizers', 'appetizers', 'Delicious starters and appetizers', NULL, 1, NOW(), NOW()),
('cat-22222222-2222-2222-2222-222222222222', 'Mains', 'mains', 'Hearty main courses', NULL, 2, NOW(), NOW()),
('cat-33333333-3333-3333-3333-333333333333', 'Desserts', 'desserts', 'Sweet treats and desserts', NULL, 3, NOW(), NOW()),
('cat-44444444-4444-4444-4444-444444444444', 'Vegan', 'vegan', 'Plant-based recipes', NULL, 4, NOW(), NOW());

-- Thêm Tags cơ bản
INSERT INTO `tags` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
('tag-11111111-1111-1111-1111-111111111111', 'Healthy', 'healthy', NOW(), NOW()),
('tag-22222222-2222-2222-2222-222222222222', 'Quick & Easy', 'quick-easy', NOW(), NOW()),
('tag-33333333-3333-3333-3333-333333333333', 'Gluten Free', 'gluten-free', NOW(), NOW());

TRUNCATE TABLE `user_profiles`;
TRUNCATE TABLE `users`;

-- Thêm Users (Có cột role: admin, vip, premium, free)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `account_status`, `role`, `created_at`, `updated_at`) VALUES
('usr-11111111-1111-1111-1111-111111111111', 'chef_james', 'james.thew@chef.com', '$2b$10$wT/eS.8kQdYQZ1vS1G1B0eO8wT.y8S3D1', 'active', 'admin', NOW(), NOW()),
('usr-22222222-2222-2222-2222-222222222222', 'Chef User', 'vu.lda.2510@aptechlearning.edu.vn', '$2b$10$wT/eS.8kQdYQZ1vS1G1B0eO8wT.y8S3D1', 'active', 'vip', NOW(), NOW()),
('usr-33333333-3333-3333-3333-333333333333', 'sara_cook', 'sara.smith@example.com', '$2b$10$wT/eS.8kQdYQZ1vS1G1B0eO8wT.y8S3D1', 'active', 'premium', NOW(), NOW()),
('usr-44444444-4444-4444-4444-444444444444', 'john_doe', 'john.doe@example.com', '$2b$10$wT/eS.8kQdYQZ1vS1G1B0eO8wT.y8S3D1', 'active', 'free', NOW(), NOW());

-- Thêm User Profiles (Khớp với giao diện Profile UI của bạn)
INSERT INTO `user_profiles` (`id`, `user_id`, `display_name`, `biography`, `cooking_style`, `focus`, `location`, `is_public`, `created_at`, `updated_at`) VALUES
('pro-11111111-1111-1111-1111-111111111111', 'usr-11111111-1111-1111-1111-111111111111', 'Chef James Thew', 'Executive Chef with 15+ years in Michelin-starred restaurants.', 'Modern Gastronomy', 'Fine Dining, French & Fusion', 'London, UK', 1, NOW(), NOW()),
('pro-22222222-2222-2222-2222-222222222222', 'usr-22222222-2222-2222-2222-222222222222', 'Chef User', 'No biography written yet.', 'Modern Gastronomy', 'Italian, BBQ', 'Hanoi, Vietnam', 1, NOW(), NOW());
TRUNCATE TABLE `membership_plans`;
TRUNCATE TABLE `contests`;

-- Thêm Gói thành viên
INSERT INTO `membership_plans` (`name`, `price`, `billing_cycle`, `features`, `is_popular`, `created_at`, `updated_at`) VALUES
('Free', 0.00, 'monthly', JSON_ARRAY('Basic access to recipes', 'Access to free recipes', 'Community forum (Read-only)', 'Basic weekly newsletter'), 0, NOW(), NOW()),
('Premium', 9.99, 'monthly', JSON_ARRAY('All Free features', 'Unlock Premium recipes', 'Step-by-step video tutorials', 'Private community access'), 1, NOW(), NOW()),
('VIP', 24.99, 'monthly', JSON_ARRAY('All Premium features', '1-on-1 Q&A with Chef James', 'Exclusive Masterclass courses', 'Downloadable resources'), 0, NOW(), NOW());


TRUNCATE TABLE `recipe_steps`;
TRUNCATE TABLE `recipe_ingredients`;
TRUNCATE TABLE `ingredients`;
TRUNCATE TABLE `recipes`;

-- Thêm Công thức (Đã bỏ category_id, thêm slug, is_featured, is_premium)
INSERT INTO `recipes` (`id`, `user_id`, `title`, `slug`, `description`, `difficulty`, `prep_time_minutes`, `cook_time_minutes`, `servings`, `status`, `thumbnail_url`, `is_featured`, `is_premium`, `created_at`, `updated_at`) VALUES
('rec-11111111-1111-1111-1111-111111111111', 'usr-11111111-1111-1111-1111-111111111111', 'Truffle Infused Wagyu Steak', 'truffle-infused-wagyu-steak', 'Pan-seared A5 Wagyu beef served with truffle butter.', 'hard', 15, 20, 2, 'published', '/images/recipes/wagyu.jpg', 1, 1, NOW(), NOW()),
('rec-22222222-2222-2222-2222-222222222222', 'usr-11111111-1111-1111-1111-111111111111', 'Classic Italian Carbonara', 'classic-italian-carbonara', 'Traditional Roman pasta with guanciale and fresh egg yolks.', 'medium', 10, 15, 4, 'published', '/images/recipes/carbonara.jpg', 0, 0, NOW(), NOW()),
('rec-33333333-3333-3333-3333-333333333333', 'usr-22222222-2222-2222-2222-222222222222', 'Crispy Garlic Bruschetta', 'crispy-garlic-bruschetta', 'Toasted sourdough topped with fresh tomatoes.', 'easy', 10, 5, 6, 'published', '/images/recipes/bruschetta.jpg', 1, 0, NOW(), NOW()),
('rec-44444444-4444-4444-4444-444444444444', 'usr-33333333-3333-3333-3333-333333333333', 'Roasted Avocado Quinoa Bowl', 'roasted-avocado-quinoa-bowl', 'Healthy power bowl with avocado and tahini.', 'easy', 15, 20, 2, 'published', '/images/recipes/quinoa.jpg', 0, 0, NOW(), NOW());

-- Map Recipe với Categories (BẢNG TRUNG GIAN)
INSERT INTO `recipe_categories` (`recipe_id`, `category_id`, `created_at`, `updated_at`) VALUES
('rec-11111111-1111-1111-1111-111111111111', 'cat-22222222-2222-2222-2222-222222222222', NOW(), NOW()), -- Wagyu -> Mains
('rec-22222222-2222-2222-2222-222222222222', 'cat-22222222-2222-2222-2222-222222222222', NOW(), NOW()), -- Carbonara -> Mains
('rec-33333333-3333-3333-3333-333333333333', 'cat-11111111-1111-1111-1111-111111111111', NOW(), NOW()), -- Bruschetta -> Appetizers
('rec-44444444-4444-4444-4444-444444444444', 'cat-44444444-4444-4444-4444-444444444444', NOW(), NOW()); -- Quinoa -> Vegan

-- Map Recipe với Tags
INSERT INTO `recipe_tags` (`recipe_id`, `tag_id`, `created_at`, `updated_at`) VALUES
('rec-44444444-4444-4444-4444-444444444444', 'tag-11111111-1111-1111-1111-111111111111', NOW(), NOW()), -- Quinoa -> Healthy
('rec-33333333-3333-3333-3333-333333333333', 'tag-22222222-2222-2222-2222-222222222222', NOW(), NOW()); -- Bruschetta -> Quick & Easy

-- Thêm Nguyên liệu (Ingredients)
INSERT INTO `ingredients` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
('ing-11111111-1111-1111-1111-111111111111', 'A5 Wagyu Beef', 'a5-wagyu-beef', NOW(), NOW()),
('ing-22222222-2222-2222-2222-222222222222', 'Truffle Butter', 'truffle-butter', NOW(), NOW());

-- Map Recipe với Ingredients (Kèm định lượng)
INSERT INTO `recipe_ingredients` (`recipe_id`, `ingredient_id`, `quantity`, `unit`, `note`, `created_at`, `updated_at`) VALUES
('rec-11111111-1111-1111-1111-111111111111', 'ing-11111111-1111-1111-1111-111111111111', 250.00, 'grams', 'Room temperature', NOW(), NOW()),
('rec-11111111-1111-1111-1111-111111111111', 'ing-22222222-2222-2222-2222-222222222222', 2.00, 'tbsp', 'For basting', NOW(), NOW());

-- Thêm Các bước nấu (Recipe Steps) cho món Wagyu
INSERT INTO `recipe_steps` (`id`, `recipe_id`, `step_number`, `title`, `instruction`, `created_at`, `updated_at`) VALUES
('stp-11111111-1111-1111-1111-111111111111', 'rec-11111111-1111-1111-1111-111111111111', 1, 'Preparation', 'Season the Wagyu beef generously with sea salt and cracked black pepper.', NOW(), NOW()),
('stp-22222222-2222-2222-2222-222222222222', 'rec-11111111-1111-1111-1111-111111111111', 2, 'Searing', 'Heat a cast-iron skillet over high heat. Sear the steak for 2 minutes on each side.', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 0;

-- Insert dữ liệu mẫu
INSERT INTO `contests` 
(`id`, `title`, `slug`, `description`, `type`, `scale`, `status`, `start_date`, `end_date`, `location`, `rules`, `prize_details`, `is_featured`, `is_banned`, `created_at`, `updated_at`) 
VALUES 
(
  UUID(), 
  'Master Chef 2026 Championship', 
  'master-chef-2026-championship', 
  'Cuộc thi nấu ăn quy mô lớn nhất dành cho các đầu bếp chuyên nghiệp để tìm ra siêu đầu bếp của năm.', 
  'offline', 
  'large', 
  'upcoming', 
  '2026-10-01 08:00:00', 
  '2026-10-15 17:00:00', 
  'Hà Nội, Việt Nam', 
  'Quy định chuẩn Master Chef Quốc Tế. Vui lòng xem chi tiết trên website.', 
  'Giải nhất: 1 Tỷ VNĐ + Cúp Vàng', 
  1, 
  0, 
  NOW(), 
  NOW()
),
(
  UUID(), 
  'Thử Thách Món Chay Mùa Hè', 
  'thu-thach-mon-chay-mua-he', 
  'Sáng tạo các món chay thanh mát, giải nhiệt cho mùa hè oi bức. Dành cho mọi đối tượng.', 
  'online', 
  'small', 
  'active', 
  '2026-07-01 00:00:00', 
  '2026-08-30 23:59:59', 
  NULL, 
  'Chỉ cần nộp hình ảnh, video chế biến và công thức chi tiết.', 
  'Giải nhất: 50 Triệu VNĐ + Bộ dụng cụ bếp cao cấp', 
  0, 
  0, 
  NOW(), 
  NOW()
);
-- ===================================================
-- 2. INSERT THÔNG TIN CUỘC THI DETAIL (MasterChef 2026)
-- ===================================================
INSERT INTO `contests` (
    `id`, 
    `title`, 
    `slug`, 
    `description`, 
    `type`, 
    `scale`, 
    `status`, 
    `start_date`, 
    `end_date`, 
    `rules`, 
    `prize_details`, 
    `is_featured`, 
    `is_banned`, 
    `author_id`, 
    `created_at`, 
    `updated_at`
) 
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'MasterChef 2026 Championship',
    'master-chef-2026-championship',
    'Cuộc thi ẩm thực đỉnh cao quy mô toàn quốc nhằm tìm kiếm tài năng đầu bếp triển vọng nhất năm 2026. Hãy thể hiện tài năng và đam mê nấu nướng của bạn ngay hôm nay!',
    'online',
    'large',
    'ongoing',
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    'Thí sinh chuẩn bị 1 món ăn chính, chụp ảnh thành phẩm chất lượng cao và trình bày quy trình chế biến chi tiết.',
    'Giải Nhất: Cúp Vàng MasterChef + 10,000 USD tiền mặt + Học bổng ẩm thực cao cấp.\nGiải Nhì: 5,000 USD tiền mặt.\nGiải Ba: 2,000 USD tiền mặt.',
    1,
    0,
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE 
    `title` = VALUES(`title`),
    `description` = VALUES(`description`),
    `status` = VALUES(`status`),
    `updated_at` = NOW();

-- ===================================================
-- 3. INSERT BÀI DỰ THI (CONTEST SUBMISSIONS)
-- ===================================================
INSERT INTO `contest_submissions` (
    `id`, 
    `contest_id`, 
    `user_id`, 
    `title`, 
    `image_url`, 
    `content`, 
    `created_at`, 
    `updated_at`
) 
VALUES 
(
    's01ebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Bò Wellington Sốt Nấm Truffle',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    'Món ăn kết hợp giữa thăn bò Úc bọc nấm Truffle và vỏ bánh ngàn lớp giòn rụm được nướng chuẩn nhiệt độ 180°C.',
    NOW(),
    NOW()
),
(
    's02ebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Cá Hồi Áp Chảo Sốt Bơ Chanh',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
    'Cá hồi Na Uy giữ nguyên độ mềm mọng, ăn kèm măng tây nướng và sốt bơ chanh béo ngậy.',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- ===================================================
-- 4. INSERT BÌNH LUẬN (COMMENTS)
-- ===================================================

INSERT INTO `comments` (
    `id`, 
    `user_id`, 
    `target_id`, 
    `target_type`, 
    `content`, 
    `is_banned`, 
    `created_at`, 
    `updated_at`
) 
VALUES 
(
    'm01ebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'contest',
    'Chúc tất cả các thí sinh thi tốt và mang đến những món ăn bùng nổ hương vị!',
    0,
    NOW(),
    NOW()
),
(
    'm02ebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'contest',
    'Giải thưởng năm nay đỉnh quá, mình vừa nộp bài thi Bò Wellington xong!',
    0,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE `updated_at` = NOW();
-- ===================================================
-- 5. INSERT LƯỢT LIKE (LIKES TĂNG DUAL RATING)
-- ===================================================
INSERT INTO `likes` (`id`, `user_id`, `target_id`, `target_type`, `created_at`, `updated_at`) 
VALUES 
(
    'l01ebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'contest',
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE `updated_at` = NOW();

-- 1. Bổ sung Avatar cho User Profiles

UPDATE user_profiles 
SET avatar_url = '/images/avatars/chef_james.jpg' 
WHERE user_id = 'usr-11111111-1111-1111-1111-111111111111';

UPDATE user_profiles 
SET avatar_url = '/images/avatars/chef_user.jpg' 
WHERE user_id = 'usr-22222222-2222-2222-2222-222222222222';


-- 2. Bổ sung Ảnh cho Bảng Cuộc Thi (Contests)
-- Thêm cột banner_image bị thiếu trong bảng contests mới
ALTER TABLE contests 
ADD COLUMN banner_image VARCHAR(255) NULL AFTER prize_details;

SET SQL_SAFE_UPDATES = 0;
-- Cập nhật ảnh cho các cuộc thi đang có
UPDATE contests 
SET banner_image = '/images/contests/masterchef-2026.png' 
WHERE slug = 'master-chef-2026-championship';

UPDATE contests 
SET banner_image = '/images/contests/vegan-summer.jpg' 
WHERE slug = 'thu-thach-mon-chay-mua-he';
UPDATE contests 
SET banner_image = '/images/contests/vegan-summer.jpg' 
WHERE slug = 'thu-thach-dau-bep-nhi';
-- Cập nhật đường dẫn ảnh cho 4 món ăn theo ID

UPDATE recipes 
SET thumbnail_url = '/images/recipes/wagyu.jpg' 
WHERE id = 'rec-11111111-1111-1111-1111-111111111111'; -- Truffle Infused Wagyu Steak

UPDATE recipes 
SET thumbnail_url = '/images/recipes/carbonara.jpg' 
WHERE id = 'rec-22222222-2222-2222-2222-222222222222'; -- Classic Italian Carbonara

UPDATE recipes 
SET thumbnail_url = '/images/recipes/bruschetta.jpg' 
WHERE id = 'rec-33333333-3333-3333-3333-333333333333'; -- Crispy Garlic Bruschetta

UPDATE recipes 
SET thumbnail_url = '/images/recipes/quinoa.jpg' 
WHERE id = 'rec-44444444-4444-4444-4444-444444444444'; -- Roasted Avocado Quinoa Bowl


INSERT INTO recipes 
(id, user_id, title, slug, description, difficulty, prep_time_minutes, cook_time_minutes, servings, status, thumbnail_url, is_featured, is_premium, created_at, updated_at) 
VALUES
(
  'rec-11111111-1111-1111-1111-111111111111', 
  'usr-11111111-1111-1111-1111-111111111111', 
  'Truffle Infused Wagyu Steak', 
  'truffle-infused-wagyu-steak', 
  'Pan-seared A5 Wagyu beef served with truffle butter.', 
  'hard', 15, 20, 2, 'published', 
  '/images/recipes/wagyu.jpg', 
  1, 1, NOW(), NOW()
),
(
  'rec-22222222-2222-2222-2222-222222222222', 
  'usr-11111111-1111-1111-1111-111111111111', 
  'Classic Italian Carbonara', 
  'classic-italian-carbonara', 
  'Traditional Roman pasta with guanciale and fresh egg yolks.', 
  'medium', 10, 15, 4, 'published', 
  '/images/recipes/carbonara.jpg', 
  0, 0, NOW(), NOW()
),
(
  'rec-33333333-3333-3333-3333-333333333333', 
  'usr-22222222-2222-2222-2222-222222222222', 
  'Crispy Garlic Bruschetta', 
  'crispy-garlic-bruschetta', 
  'Toasted sourdough topped with fresh tomatoes.', 
  'easy', 10, 5, 6, 'published', 
  '/images/recipes/bruschetta.jpg', 
  1, 0, NOW(), NOW()
),
(
  'rec-44444444-4444-4444-4444-444444444444', 
  'usr-33333333-3333-3333-3333-333333333333', 
  'Roasted Avocado Quinoa Bowl', 
  'roasted-avocado-quinoa-bowl', 
  'Healthy power bowl with avocado and tahini.', 
  'easy', 15, 20, 2, 'published', 
  '/images/recipes/quinoa.jpg', 
  0, 0, NOW(), NOW()
)
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  slug = VALUES(slug),
  description = VALUES(description),
  thumbnail_url = VALUES(thumbnail_url),
  updated_at = NOW();
  
  -- 1. Insert User mẫu (nếu chưa có)
INSERT INTO `users` (`id`, `email`, `username`, `password_hash`, `role`, `account_status`, `created_at`, `updated_at`)
VALUES 
('usr-demo-001', 'chef.minh@example.com', 'ChefMinh', '$2a$10$hashedpassword', 'free', 'active', NOW(), NOW()),
('usr-demo-002', 'lan.nguyen@example.com', 'LanNguyen', '$2a$10$hashedpassword', 'free', 'active', NOW(), NOW());

-- 2. Insert Cuộc thi mẫu
INSERT INTO `contests` (`id`, `title`, `slug`, `description`, `type`, `scale`, `status`, `start_date`, `end_date`, `author_id`, `created_at`, `updated_at`)
VALUES 
('cts-2026-001', 'Vua Đầu Bếp Nhí 2026', 'vua-dau-bep-nhi-2026', 'Cuộc thi nấu ăn sáng tạo dành cho các tài năng trẻ', 'online', 'large', 'ended', '2026-01-10 08:00:00', '2026-03-20 18:00:00', 'usr-demo-001', NOW(), NOW());

-- 3. Insert Bài dự thi mẫu
INSERT INTO `contest_submissions` (`id`, `contest_id`, `user_id`, `title`, `image_url`, `content`, `created_at`, `updated_at`)
VALUES 
('sub-2026-001', 'cts-2026-001', 'usr-demo-001', 'Món Phở Cuộn Tôm Hùm Sáng Tạo', '/uploads/pho-cuon.jpg', 'Bài thi kết hợp giữa văn hóa ẩm thực truyền thống và hiện đại.', NOW(), NOW()),
('sub-2026-002', 'cts-2026-001', 'usr-demo-002', 'Bánh Bột Lọc Nhân Nấm Mèo', '/uploads/banh-bot-loc.jpg', 'Bài thi thuần chay thanh tịnh.', NOW(), NOW());

-- 4. Insert Danh sách Vinh Danh (Winners)
INSERT INTO `contest_winners` (`id`, `contest_id`, `user_id`, `submission_id`, `rank`, `prize`, `created_at`, `updated_at`)
VALUES 
('win-2026-001', 'cts-2026-001', 'usr-demo-001', 'sub-2026-001', 1, 'Cúp Vàng + 20.000.000 VNĐ', NOW(), NOW()),
('win-2026-002', 'cts-2026-001', 'usr-demo-002', 'sub-2026-002', 2, 'Bằng Khen + 10.000.000 VNĐ', NOW(), NOW());


SET FOREIGN_KEY_CHECKS = 1;
  SET SQL_SAFE_UPDATES = 1;