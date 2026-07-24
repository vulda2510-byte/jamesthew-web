'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
  static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
      // Contest.hasMany(models.ContestSubmission, { foreignKey: 'contest_id', as: 'submissions' });
      // Contest.hasMany(models.ContestWinner, { foreignKey: 'contest_id', as: 'winners' });
    }
  }

  Comment.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    target_id: { type: DataTypes.UUID, allowNull: false },
    target_type: { type: DataTypes.ENUM('contest', 'submission'), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    is_banned: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Comment;
};