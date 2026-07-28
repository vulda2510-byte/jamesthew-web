// src/models/userProfile.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    //  * Khai báo các mối quan hệ (Association)
    static associate(models) {
      // Một Profile thuộc về Một User
      UserProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
      });
    }
  }

  UserProfile.init(
    {
      id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
          model: 'users', // Trỏ tới tên bảng users trong DB
          key: 'id'
        }
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      display_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      cover_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      biography: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      gender: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      cooking_style: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      focus: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'UserProfile',
      tableName: 'user_profiles', // Tên bảng chính xác trong MySQL
      freezeTableName: true,
      timestamps: true,          // Tự động quản lý created_at, updated_at
      paranoid: true,            // Soft Delete (sử dụng deleted_at)
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  );

  return UserProfile;
};