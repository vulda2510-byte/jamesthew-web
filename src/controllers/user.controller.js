// src/controllers/user.controller.js
const bcrypt = require('bcrypt');
const { User, UserProfile, Recipe } = require('../models');

// Cập nhật thông tin Profile (AJAX PUT)
const updateProfile = async (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const { firstName, lastName, bio, cookingStyle, location, website } = req.body;

        let profile = await UserProfile.findOne({ where: { user_id: userId } });

        if (profile) {
            await profile.update({
                first_name: firstName,
                last_name: lastName,
                biography: bio,
                cooking_style: cookingStyle,
                location: location,
                website: website
            });
        } else {
            await UserProfile.create({
                user_id: userId,
                first_name: firstName,
                last_name: lastName,
                biography: bio,
                cooking_style: cookingStyle,
                location: location,
                website: website
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật hồ sơ thành công!"
        });
    } catch (error) {
        console.error("Lỗi updateProfile:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống khi cập nhật hồ sơ." });
    }
};

// Đổi mật khẩu (AJAX PUT)
const changePassword = async (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: "Mật khẩu xác nhận không khớp." });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản." });
        }

        // Nếu người dùng gửi kèm mật khẩu hiện tại để xác thực
        if (currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không chính xác." });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await user.update({ password_hash: hashedPassword });

        return res.status(200).json({
            success: true,
            message: "Đổi mật khẩu thành công!"
        });
    } catch (error) {
        console.error("Lỗi changePassword:", error);
        return res.status(500).json({ success: false, message: "Lỗi khi cập nhật mật khẩu." });
    }
};

module.exports = {
    updateProfile,
    changePassword
};