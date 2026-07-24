'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DailyLimit extends Model {
    static associate(models) {
      DailyLimit.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  DailyLimit.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    action_type: { type: DataTypes.ENUM('faq_ask', 'comment', 'contest_create'), allowNull: false },
    action_date: { type: DataTypes.DATEONLY, allowNull: false },
    count: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {
    sequelize,
    modelName: 'DailyLimit',
    tableName: 'daily_limits',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return DailyLimit;
};