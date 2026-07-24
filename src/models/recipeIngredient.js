'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RecipeIngredient extends Model {
    static associate(models) {
      RecipeIngredient.belongsTo(models.Recipe, {
        foreignKey: 'recipe_id',
        as: 'recipe'
      });

      RecipeIngredient.belongsTo(models.Ingredient, {
        foreignKey: 'ingredient_id',
        as: 'ingredient'
      });
    }
  }

  RecipeIngredient.init({
    recipe_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    },
    ingredient_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'RecipeIngredient',
    tableName: 'recipe_ingredients',
    freezeTableName: true,
    timestamps: true,
    paranoid: false,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return RecipeIngredient;
};