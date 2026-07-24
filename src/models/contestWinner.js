'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContestWinner extends Model {
    static associate(models) {
      ContestWinner.belongsTo(models.Contest, { foreignKey: 'contest_id', as: 'contest' });
      ContestWinner.belongsTo(models.User, { foreignKey: 'user_id', as: 'winner' });
      ContestWinner.belongsTo(models.ContestSubmission, { foreignKey: 'submission_id', as: 'winning_submission' });
    }
  }

  ContestWinner.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    contest_id: { type: DataTypes.UUID, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    submission_id: { type: DataTypes.UUID, allowNull: true },
    rank_position: { type: DataTypes.INTEGER, allowNull: false },
    prize_title: { type: DataTypes.STRING, allowNull: true }
  }, {
    sequelize,
    modelName: 'ContestWinner',
    tableName: 'contest_winners',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ContestWinner;
};