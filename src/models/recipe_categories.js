'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RecipeCategory extends Model {
    static associate(models) {
      RecipeCategory.belongsTo(models.Recipe, {
        foreignKey: 'recipe_id',
        as: 'recipe'
      });

      RecipeCategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
    }
  }

  RecipeCategory.init({
    recipe_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'RecipeCategory',
    tableName: 'recipe_categories',
    freezeTableName: true,
    timestamps: true,
    paranoid: false,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return RecipeCategory;
};