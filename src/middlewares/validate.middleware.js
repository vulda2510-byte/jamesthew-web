'use strict';

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next();
  }

  const formattedErrors = errors.array().map(err => ({
    field: err.path || err.param,
    message: err.msg
  }));

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: formattedErrors
  });
};

module.exports = validate;