'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Like.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    target_id: { type: DataTypes.UUID, allowNull: false },
    target_type: { type: DataTypes.ENUM('contest', 'submission', 'user_profile'), allowNull: false }
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'likes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Like;
};