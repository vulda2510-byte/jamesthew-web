'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavedRecipe extends Model {
    static associate(models) {
      SavedRecipe.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      SavedRecipe.belongsTo(models.Recipe, { foreignKey: 'recipe_id', as: 'recipe' });
    }
  }

  SavedRecipe.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    recipe_id: { type: DataTypes.UUID, allowNull: false }
  }, {
    sequelize,
    modelName: 'SavedRecipe',
    tableName: 'saved_recipes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return SavedRecipe;
};