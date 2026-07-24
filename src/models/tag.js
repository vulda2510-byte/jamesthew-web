'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Recipe,{
    through: models.RecipeTag,
    foreignKey:'tag_id',
    otherKey:'recipe_id',
    as:'recipes'
    }); 
    }
  }

  Tag.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(60),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Tag;
};