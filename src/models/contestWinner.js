'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContestWinner extends Model {
    static associate(models) {
      ContestWinner.belongsTo(models.Contest, { as: 'contest', foreignKey: 'contest_id' });
      ContestWinner.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      ContestWinner.belongsTo(models.ContestSubmission, { as: 'submission', foreignKey: 'submission_id' });
    }
  }

  ContestWinner.init({
    id: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    contest_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    submission_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prize: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
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