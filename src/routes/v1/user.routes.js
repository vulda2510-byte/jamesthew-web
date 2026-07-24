// src/routes/v1/user.routes.js
const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();

// Lấy danh sách users (Dùng cho test GET)
router.get('/', userController.getUsers);

// Thêm route POST này để tạo user mới
router.post('/', userController.createUser);

module.exports = router;