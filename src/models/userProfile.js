'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  UserProfile.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    first_name: { type: DataTypes.STRING(100) },
    last_name: { type: DataTypes.STRING(100) },
    biography: { type: DataTypes.TEXT },
    cooking_style: { type: DataTypes.STRING(100) },
    location: { type: DataTypes.STRING(100) },
    website: { type: DataTypes.STRING(255) },
    phone: { type: DataTypes.STRING(30) },
    avatar_url: { type: DataTypes.STRING(255) }
  }, {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return UserProfile; 
};