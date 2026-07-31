// src/routes/v1/recipe.routes.js
const express = require('express');
const recipeController = require('../../controllers/recipe.controller');
const { requireAuthApi } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Tạo recipe mới (POST /api/v1/recipes)
router.post('/', recipeController.create);

// Lấy danh sách toàn bộ recipe (GET /api/v1/recipes)
router.get('/', recipeController.getAll);

// Lưu / bỏ lưu công thức vào Saved Recipes của user hiện tại
router.get('/:id/save', requireAuthApi, recipeController.getSaveStatus);
router.post('/:id/save', requireAuthApi, recipeController.saveRecipe);
router.delete('/:id/save', requireAuthApi, recipeController.unsaveRecipe);

// Lấy chi tiết recipe theo ID (GET /api/v1/recipes/:id)
router.get('/:id', recipeController.getById);

// Lấy chi tiết recipe theo Slug (GET /api/v1/recipes/slug/:slug)
router.get('/slug/:slug', recipeController.getBySlug);

// Cập nhật recipe (PUT /api/v1/recipes/:id)
router.put('/:id', recipeController.update);

// Xóa recipe (DELETE /api/v1/recipes/:id)
router.delete('/:id', recipeController.delete);

module.exports = router;