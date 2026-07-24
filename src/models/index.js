'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const userProfile = require('./userProfile');

// Các model cũ
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Recipe = require('./recipe')(sequelize, Sequelize.DataTypes);
const Category = require('./category')(sequelize, Sequelize.DataTypes);
const Ingredient = require('./ingredient')(sequelize, Sequelize.DataTypes);
const Tag = require('./tag')(sequelize, Sequelize.DataTypes);
const RecipeStep = require('./recipeStep')(sequelize, Sequelize.DataTypes);
const RecipeImage = require('./recipeImage')(sequelize, Sequelize.DataTypes);
const RecipeIngredient = require('./recipeIngredient')(sequelize, Sequelize.DataTypes);
const RecipeTag = require('./recipeTag')(sequelize, Sequelize.DataTypes);
const RecipeCategory = require('./recipe_categories')(sequelize, Sequelize.DataTypes);
const UserProfile = require('./userProfile')(sequelize, Sequelize.DataTypes);
// Các model mới cho Contest & Tương tác
const Contest = require('./contest')(sequelize, Sequelize.DataTypes);
const ContestSubmission = require('./contestSubmission')(sequelize, Sequelize.DataTypes);
const ContestWinner = require('./contestWinner')(sequelize, Sequelize.DataTypes);
const Comment = require('./comment')(sequelize, Sequelize.DataTypes);
const Like = require('./like')(sequelize, Sequelize.DataTypes);
const FAQ = require('./faq')(sequelize, Sequelize.DataTypes);
const DailyLimit = require('./dailyLimit')(sequelize, Sequelize.DataTypes);

// Gom tất cả model
const db = {
  sequelize,
  Sequelize,
  User,
  Recipe,
  Category,
  Ingredient,
  Tag,
  RecipeStep,
  RecipeImage,
  RecipeIngredient,
  RecipeTag,
  RecipeCategory,
  Contest,
  ContestSubmission,
  ContestWinner,
  Comment,
  Like,
  FAQ,
  UserProfile,
  DailyLimit
};

// Gọi associate()
Object.values(db).forEach((model) => {
  if (model && typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;