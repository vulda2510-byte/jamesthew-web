const profileService = require('../services/profile.service');

const updateProfile = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        const { firstName, lastName, bio, cookingStyle, location, website, phone } = req.body;
        const result = await profileService.updateProfile(userId, {
            firstName, lastName, bio, cookingStyle, location, website, phone
        });

        return res.status(200).json({ success: true, message: 'Profile updated.', ...result });
    } catch (error) {
        console.error('updateProfile error:', error);
        return res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const updateEmail = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        const { email } = req.body;
        await profileService.updateEmail(userId, email);

        return res.status(200).json({ success: true, message: 'Email updated.' });
    } catch (error) {
        console.error('updateEmail error:', error);
        return res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        await profileService.changePassword(userId, { currentPassword, newPassword, confirmNewPassword });

        return res.status(200).json({ success: true, message: 'Password updated.' });
    } catch (error) {
        console.error('changePassword error:', error);
        return res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const uploadAvatar = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please select an image file.' });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const result = await profileService.updateAvatar(userId, avatarUrl);

        return res.status(200).json({ success: true, message: 'Avatar updated.', ...result });
    } catch (error) {
        console.error('uploadAvatar error:', error);
        return res.status(500).json({ success: false, message: 'Avatar upload failed.' });
    }
};

const searchUsers = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        const results = await profileService.searchUsers(req.query.q, userId);
        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error('searchUsers error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const unfollowUser = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        const { id: followingId } = req.params;
        await profileService.unfollowUser(userId, followingId);

        return res.status(200).json({ success: true, message: 'Unfollowed.' });
    } catch (error) {
        console.error('unfollowUser error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    updateProfile,
    updateEmail,
    changePassword,
    uploadAvatar,
    searchUsers,
    unfollowUser
};
