// src/routes/v1/user.routes.js
const express = require('express');
const userController = require('../../controllers/user.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.put('/profile', requireAuth, userController.updateProfile);
router.put('/change-password', requireAuth, userController.changePassword);

module.exports = router;