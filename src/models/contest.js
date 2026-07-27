'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Contest extends Model {
    static associate(models) {
      Contest.belongsTo(models.User, { as: 'author', foreignKey: 'author_id' });
      Contest.hasMany(models.ContestSubmission, { as: 'submissions', foreignKey: 'contest_id' });
      Contest.hasMany(models.ContestWinner, { as: 'winners', foreignKey: 'contest_id' });
    }
  }

  Contest.init({
    id: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: 'online',
      allowNull: false
    },
    scale: {
      type: DataTypes.STRING(50),
      defaultValue: 'small',
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'upcoming',
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    banner_image: {
    type: DataTypes.STRING,
    allowNull: true
    },
    ban_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    author_id: {
      type: DataTypes.STRING(100),
      allowNull: true
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