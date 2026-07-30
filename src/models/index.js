'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// 1. Khởi tạo các Models
const User = require('./user')(sequelize, DataTypes);
const Recipe = require('./recipe')(sequelize, DataTypes);
const Category = require('./category')(sequelize, DataTypes);
const Ingredient = require('./ingredient')(sequelize, DataTypes);
const Tag = require('./tag')(sequelize, DataTypes);
const RecipeStep = require('./recipeStep')(sequelize, DataTypes);
const RecipeImage = require('./recipeImage')(sequelize, DataTypes);
const RecipeIngredient = require('./recipeIngredient')(sequelize, DataTypes);
const RecipeTag = require('./recipeTag')(sequelize, DataTypes);
const RecipeCategory = require('./recipe_categories')(sequelize, DataTypes);
const UserProfile = require('./userProfile')(sequelize, DataTypes);

// Các model cho Contest & Tương tác
const Contest = require('./contest')(sequelize, DataTypes);
const ContestSubmission = require('./contestSubmission')(sequelize, DataTypes);
const ContestWinner = require('./contestWinner')(sequelize, DataTypes);
const Comment = require('./comment')(sequelize, DataTypes);
const Like = require('./like')(sequelize, DataTypes);
const FAQ = require('./faq')(sequelize, DataTypes);
const DailyLimit = require('./dailyLimit')(sequelize, DataTypes);
const Contact = require('./contact')(sequelize, DataTypes);
const SavedRecipe = require('./savedrecipe')(sequelize, DataTypes);
const UserFollow = require('./userfollow')(sequelize, DataTypes);

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
  DailyLimit,
  Contact,
  SavedRecipe,
  UserFollow
};

// 2. Tự động gọi hàm associate() bên trong từng model (Nếu có)
Object.values(db).forEach((model) => {
  if (model && typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;