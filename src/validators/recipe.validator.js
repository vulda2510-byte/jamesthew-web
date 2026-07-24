'use strict';
const { body } = require('express-validator');

const createRecipe = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
  body('slug')
    .notEmpty().withMessage('Slug is required')
    .isString().withMessage('Slug must be a string')
    .isLength({ max: 255 }).withMessage('Slug must not exceed 255 characters'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  body('prep_time_minutes')
    .optional()
    .isInt({ min: 0 }).withMessage('Prep time must be an integer not less than 0'),
  body('cook_time_minutes')
    .optional()
    .isInt({ min: 0 }).withMessage('Cook time must be an integer not less than 0'),
  body('servings')
    .optional()
    .isInt({ min: 1 }).withMessage('Servings must be an integer not less than 1'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('thumbnail_url')
    .optional()
    .isURL().withMessage('Thumbnail URL must be a valid URL')
];

const updateRecipe = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
  body('slug')
    .optional()
    .isString().withMessage('Slug must be a string')
    .isLength({ max: 255 }).withMessage('Slug must not exceed 255 characters'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  body('prep_time_minutes')
    .optional()
    .isInt({ min: 0 }).withMessage('Prep time must be an integer not less than 0'),
  body('cook_time_minutes')
    .optional()
    .isInt({ min: 0 }).withMessage('Cook time must be an integer not less than 0'),
  body('servings')
    .optional()
    .isInt({ min: 1 }).withMessage('Servings must be an integer not less than 1'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('thumbnail_url')
    .optional()
    .isURL().withMessage('Thumbnail URL must be a valid URL')
];

module.exports = {
  createRecipe,
  updateRecipe
};