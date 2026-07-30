'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserSubscription extends Model {
    static associate(models) {
      UserSubscription.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      UserSubscription.belongsTo(models.MembershipPlan, { foreignKey: 'plan_id', as: 'plan' });
    }
  }

  UserSubscription.init({
    id: { 
      type: DataTypes.CHAR(36), 
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true 
    },
    user_id: { 
      type: DataTypes.CHAR(36), 
      allowNull: false 
    },
    plan_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    status: { 
      type: DataTypes.STRING(50), 
      defaultValue: 'active' 
    },
    start_date: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    end_date: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    auto_renew: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    }
  }, {
    sequelize,
    modelName: 'UserSubscription',
    tableName: 'user_subscriptions',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return UserSubscription;
};