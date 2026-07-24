'use strict';

const errorHandler = (error, req, res, next) => {
  if (error.message === 'Recipe not found') {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  if (error.message === 'Recipe slug already exists') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Handle express-validator errors (often passed as an array of errors or an object with an 'errors' property)
  if (Array.isArray(error) || error.errors || error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error'
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
};

module.exports = errorHandler;