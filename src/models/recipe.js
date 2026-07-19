'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      // A Recipe belongs to an author (User)
      Recipe.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    }
  }
  Recipe.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    ingredients: {
      type: DataTypes.JSON,
      allowNull: false
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cookingTime: DataTypes.INTEGER,
    isPremiumOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    authorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};