const express = require('express');
const userController = require('../../controllers/user.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');
const router = express.Router();

// Routes cập nhật thông tin cá nhân, đổi mật khẩu và avatar
router.put('/profile', requireAuth, userController.updateProfile);
router.put('/change-password', requireAuth, userController.changePassword);
router.post('/avatar', requireAuth, upload.single('avatar'), userController.uploadAvatar);

module.exports = router;