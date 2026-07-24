'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RecipeTag extends Model {
static associate(models) {
  RecipeTag.belongsTo(models.Recipe, {
    foreignKey: 'recipe_id',
    as: 'recipe'
  });

  RecipeTag.belongsTo(models.Tag, {
    foreignKey: 'tag_id',
    as: 'tag'
  });
}
  }

  RecipeTag.init({
    recipe_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'RecipeTag',
    tableName: 'recipe_tags',
    freezeTableName: true,
    timestamps: true,
    paranoid: false,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return RecipeTag;
};