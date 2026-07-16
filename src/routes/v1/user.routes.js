// src/routes/v1/user.routes.js
const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.get('/', userController.getUsers);

module.exports = router;