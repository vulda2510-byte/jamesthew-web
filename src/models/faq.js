'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FAQ extends Model {
    static associate(models) {
      FAQ.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
    }
  }

  FAQ.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    question: { type: DataTypes.TEXT, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING, defaultValue: 'General' },
    author_id: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'answered', 'hidden'), defaultValue: 'pending' }
  }, {
    sequelize,
    modelName: 'FAQ',
    tableName: 'faqs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return FAQ;
};