'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContestSubmission extends Model {
    static associate(models) {
      ContestSubmission.belongsTo(models.Contest, { foreignKey: 'contest_id', as: 'contest' });
      ContestSubmission.belongsTo(models.User, { foreignKey: 'user_id', as: 'participant' });
      ContestSubmission.belongsTo(models.Recipe, { foreignKey: 'recipe_id', as: 'recipe' });
      ContestSubmission.hasOne(models.ContestWinner, { foreignKey: 'submission_id', as: 'winning_record' });
    }
  }

  ContestSubmission.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contest_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    recipe_id: { type: DataTypes.UUID, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING, allowNull: true },
    judge_score: { type: DataTypes.FLOAT, defaultValue: 0 },
    judge_feedback: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('registered', 'submitted', 'evaluated'), defaultValue: 'registered' }
  }, {
    sequelize,
    modelName: 'ContestSubmission',
    tableName: 'contest_submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ContestSubmission;
};