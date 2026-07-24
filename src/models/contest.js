'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contest extends Model {}

  Contest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('online', 'offline'),
      defaultValue: 'online',
      allowNull: false
    },
    scale: {
      type: DataTypes.ENUM('small', 'large'),
      defaultValue: 'small',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'ongoing', 'ended'),
      defaultValue: 'upcoming',
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true // Dành riêng cho cuộc thi Offline
    },
    rules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prize_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ban_reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Contest',
    tableName: 'contests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Contest;
};