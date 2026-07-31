'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Bọc kiểm tra an toàn để tránh crash khi model chưa load
      if (models.UserProfile) {
        User.hasOne(models.UserProfile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE' });
      }
      if (models.UserSubscription) {
        User.hasOne(models.UserSubscription, { foreignKey: 'user_id', as: 'subscription', onDelete: 'CASCADE' });
      }
      if (models.Recipe) {
        User.hasMany(models.Recipe, { foreignKey: 'user_id', as: 'recipes' });
      }
      if (models.SavedRecipe) {
        User.hasMany(models.SavedRecipe, { foreignKey: 'user_id', as: 'savedRecipes' });
      }
      if (models.UserFollow) {
        User.hasMany(models.UserFollow, { foreignKey: 'following_id', as: 'followers' });
        User.hasMany(models.UserFollow, { foreignKey: 'follower_id', as: 'following' });
      }
      if (models.Contest) {
        User.hasMany(models.Contest, { foreignKey: 'author_id', as: 'created_contests' });
      }
      if (models.ContestSubmission) {
        User.hasMany(models.ContestSubmission, { foreignKey: 'user_id', as: 'contest_submissions' });
      }
      if (models.Comment) {
        User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
      }
      if (models.Like) {
        User.hasMany(models.Like, { foreignKey: 'user_id', as: 'likes' });
      }
      if (models.FAQ) {
        User.hasMany(models.FAQ, { foreignKey: 'author_id', as: 'faqs' });
      }
      if (models.DailyLimit) {
        User.hasMany(models.DailyLimit, { foreignKey: 'user_id', as: 'daily_limits' });
      }
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
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'free'
    },
    account_status: {
      type: DataTypes.ENUM('pending', 'active', 'suspended', 'banned'),
      allowNull: false,
      defaultValue: 'pending'
    },
    email_verified_at: { type: DataTypes.DATE, allowNull: true },
    last_login_at: { type: DataTypes.DATE, allowNull: true },
    stripe_customer_id: { type: DataTypes.STRING(255), allowNull: true }
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