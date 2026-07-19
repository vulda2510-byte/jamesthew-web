'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A User can author many recipes
      User.hasMany(models.Recipe, { foreignKey: 'authorId', as: 'recipes' });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    stripeCustomerId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};