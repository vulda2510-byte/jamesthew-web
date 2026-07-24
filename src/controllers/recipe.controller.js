'use strict';
const recipeService = require('../services/recipe.service');

class RecipeController {
  async create(req, res) {
    try {
      // Create user_id should be handled from auth context usually, assuming req.body contains it for now
      const recipe = await recipeService.create(req.body);
      return res.status(201).json({
        success: true,
        data: recipe
      });
    } catch (error) {
      if (error.message === 'Recipe slug already exists') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
async getAll(req, res) {
    try {
      // Kết quả trả về lúc này là một Object chứa 'rows' và 'count'
      const result = await recipeService.findAll(req.query);
      
      return res.status(200).json({
        success: true,
        // Chỉ lấy mảng dữ liệu gán vào data để Frontend hiểu được
        data: result.rows, 
        // Trả thêm tổng số lượng để Frontend có thể làm các nút chuyển trang 1, 2, 3
        total: result.count 
      });
    } catch (error) {
      console.error('LỖI TẠI GET ALL RECIPES:', error); 
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getById(req, res) {
    try {
      console.log("Tham số truyền lên là:", req.params);
      const recipe = await recipeService.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: recipe
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getBySlug(req, res) {
    try {
      const recipe = await recipeService.findBySlug(req.params.slug);
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: recipe
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async update(req, res) {
    try {
      const recipe = await recipeService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data: recipe
      });
    } catch (error) {
      if (error.message === 'Recipe not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Recipe slug already exists') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async delete(req, res) {
    try {
      await recipeService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      if (error.message === 'Recipe not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = new RecipeController();