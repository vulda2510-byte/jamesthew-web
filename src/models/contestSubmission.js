'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContestSubmission extends Model {
    static associate(models) {
      ContestSubmission.belongsTo(models.Contest, { as: 'contest', foreignKey: 'contest_id' });
      ContestSubmission.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
      ContestSubmission.hasOne(models.ContestWinner, { as: 'winner', foreignKey: 'submission_id' });
    }
  }

  ContestSubmission.init({
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    }
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