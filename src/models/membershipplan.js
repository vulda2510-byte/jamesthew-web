'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MembershipPlan extends Model {
    static associate(models) {
      if (models.UserSubscription) {
        MembershipPlan.hasMany(models.UserSubscription, { foreignKey: 'plan_id', as: 'subscriptions' });
      }
    }
  }

  MembershipPlan.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    billing_cycle: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'monthly'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_popular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'MembershipPlan',
    tableName: 'membership_plans',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return MembershipPlan;
};
