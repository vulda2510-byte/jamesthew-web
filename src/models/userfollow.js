'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserFollow extends Model {
    static associate(models) {
      UserFollow.belongsTo(models.User, { foreignKey: 'follower_id', as: 'follower' });
      UserFollow.belongsTo(models.User, { foreignKey: 'following_id', as: 'following' });
    }
  }

  UserFollow.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    follower_id: { type: DataTypes.UUID, allowNull: false },
    following_id: { type: DataTypes.UUID, allowNull: false }
  }, {
    sequelize,
    modelName: 'UserFollow',
    tableName: 'user_follows',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return UserFollow;
};