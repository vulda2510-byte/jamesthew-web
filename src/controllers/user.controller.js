const bcrypt = require('bcrypt');
const { User, UserProfile } = require('../models');

const updateProfile = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        const { firstName, lastName, bio, cookingStyle, location, website } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        const [profile] = await UserProfile.findOrCreate({
            where: { user_id: userId },
            defaults: {
                user_id: userId,
                first_name: firstName || '',
                last_name: lastName || '',
                biography: bio || '',
                cooking_style: cookingStyle || '',
                location: location || '',
                website: website || ''
            }
        });

        await profile.update({
            first_name: firstName !== undefined ? firstName : profile.first_name,
            last_name: lastName !== undefined ? lastName : profile.last_name,
            biography: bio !== undefined ? bio : profile.biography,
            cooking_style: cookingStyle !== undefined ? cookingStyle : profile.cooking_style,
            location: location !== undefined ? location : profile.location,
            website: website !== undefined ? website : profile.website
        });

        return res.status(200).json({ success: true, message: 'Profile updated.' });
    } catch (error) {
        console.error('updateProfile error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res, next) => {
    try {
        const userId = res.locals.user?.id;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: 'Password confirmation does not match.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password_hash: hashedPassword });

        return res.status(200).json({ success: true, message: 'Password updated.' });
    } catch (error) {
        console.error('changePassword error:', error);
        return res.status(500).json({ success: false, message: error.message });
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

        const [profile] = await UserProfile.findOrCreate({
            where: { user_id: userId },
            defaults: { user_id: userId, avatar_url: avatarUrl }
        });

        await profile.update({ avatar_url: avatarUrl });

        return res.status(200).json({ success: true, message: 'Avatar updated.', avatarUrl });
    } catch (error) {
        console.error('uploadAvatar error:', error);
        return res.status(500).json({ success: false, message: 'Avatar upload failed.' });
    }
};

module.exports = {
    updateProfile,
    changePassword,
    uploadAvatar
};
