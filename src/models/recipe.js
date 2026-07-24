'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'author'
      });

      Recipe.belongsToMany(models.Category, {
        through: models.RecipeCategory,
        foreignKey: 'recipe_id',
        otherKey: 'category_id',
        as: 'categories' // Đã chuyển thành số nhiều (categories)
      });

      Recipe.belongsToMany(models.Ingredient, {
        through: models.RecipeIngredient,
        foreignKey: 'recipe_id',
        otherKey: 'ingredient_id',
        as: 'ingredients'
      });

      Recipe.belongsToMany(models.Tag, {
        through: models.RecipeTag,
        foreignKey: 'recipe_id',
        otherKey: 'tag_id',
        as: 'tags'
      });

      Recipe.hasMany(models.RecipeStep, {
        foreignKey: 'recipe_id',
        as: 'steps'
      });

      Recipe.hasMany(models.RecipeImage, {
        foreignKey: 'recipe_id',
        as: 'images'
      });
    }
  }

  Recipe.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prep_time_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cook_time_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'draft',
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: 'Recipe',
    tableName: 'recipes',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Recipe;
};