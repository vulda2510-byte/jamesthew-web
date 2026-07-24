// src/models/user.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Recipe, {
        foreignKey: 'user_id',
        as: 'recipes'
      });
      User.hasMany(models.Contest, { foreignKey: 'author_id', as: 'created_contests' });
    User.hasMany(models.ContestSubmission, { foreignKey: 'user_id', as: 'contest_submissions' });
    User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
    User.hasMany(models.Like, { foreignKey: 'user_id', as: 'likes' });
    User.hasMany(models.FAQ, { foreignKey: 'author_id', as: 'faqs' });
    User.hasMany(models.DailyLimit, { foreignKey: 'user_id', as: 'daily_limits' });
    }
  }
  
  User.init({
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    account_status: {
      type: DataTypes.ENUM('pending', 'active', 'suspended', 'banned'),
      allowNull: false,
      defaultValue: 'pending'
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    stripe_customer_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  
  return User;
};