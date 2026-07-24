'use strict';
const recipeRepository = require('../repositories/recipe.repository');

class RecipeService {
  async create(data) {
    if (data.slug) {
      const existingRecipe = await recipeRepository.findBySlug(data.slug);
      if (existingRecipe) {
        throw new Error('Recipe slug already exists');
      }
    }
    return recipeRepository.create(data);
  }

  async findById(id) {
    return recipeRepository.findById(id); // Chỉ gọi qua Repository
  }

  async findBySlug(slug) {
    return recipeRepository.findBySlug(slug);
  }

  async findAll(filters = {}) {
    return recipeRepository.findAll(filters);
  }

  async update(id, data) {
    const existingRecipe = await recipeRepository.findById(id);
    if (!existingRecipe) {
      throw new Error('Recipe not found');
    }

    if (data.slug && data.slug !== existingRecipe.slug) {
      const slugExists = await recipeRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new Error('Recipe slug already exists');
      }
    }

    return recipeRepository.update(id, data);
  }

  async delete(id) {
    const existingRecipe = await recipeRepository.findById(id);
    if (!existingRecipe) {
      throw new Error('Recipe not found');
    }
    return recipeRepository.delete(id);
  }
}

module.exports = new RecipeService();