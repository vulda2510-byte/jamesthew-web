const express = require('express');
const userController = require('../../controllers/user.controller');
const { requireAuthApi } = require('../../middlewares/auth.middleware');
const upload = require('../../middlewares/upload.middleware');
const router = express.Router();

// Routes cập nhật thông tin cá nhân, email, mật khẩu, avatar, tìm kiếm và unfollow
router.get('/search', requireAuthApi, userController.searchUsers);
router.put('/profile', requireAuthApi, userController.updateProfile);
router.put('/email', requireAuthApi, userController.updateEmail);
router.put('/change-password', requireAuthApi, userController.changePassword);
router.post('/avatar', requireAuthApi, upload.uploadAvatarSingle, userController.uploadAvatar);
router.delete('/following/:id', requireAuthApi, userController.unfollowUser);

module.exports = router;
