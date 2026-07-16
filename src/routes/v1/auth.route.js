// src/routes/v1/auth.route.js
const express = require('express');
const authController = require('../../controllers/auth.controller');
const authValidator = require('../../validators/auth.validator');

const router = express.Router();

router.post('/login', authValidator.validateLogin, authController.login);
router.post('/register', authValidator.validateRegister, authController.register);
router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);

module.exports = router;