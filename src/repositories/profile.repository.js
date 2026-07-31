// src/repositories/profile.repository.js
const { Op } = require('sequelize');
const BaseRepository = require('./base.repository');
const {
    User,
    UserProfile,
    Recipe,
    SavedRecipe,
    UserFollow,
    UserSubscription,
    MembershipPlan,
    Like
} = require('../models');

class ProfileRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findUserById(userId) {
        return User.findByPk(userId);
    }

    async findUserWithProfile(userId) {
        return User.findByPk(userId, {
            include: [{ model: UserProfile, as: 'profile', required: false }]
        });
    }

    async countRecipes(userId) {
        return Recipe.count({ where: { user_id: userId } });
    }

    async countFollowers(userId) {
        return UserFollow.count({ where: { following_id: userId } });
    }

    async countSaved(userId) {
        return SavedRecipe.count({ where: { user_id: userId } });
    }

    async countLikesOnUserRecipes(userId) {
        const userRecipes = await Recipe.findAll({ where: { user_id: userId }, attributes: ['id'] });
        const recipeIds = userRecipes.map(r => r.id);
        if (recipeIds.length === 0) return 0;
        return Like.count({ where: { target_id: recipeIds, target_type: 'recipe' } });
    }

    async findMyRecipes(userId) {
        return Recipe.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
    }

    async findSavedRecipes(userId) {
        const savedRecords = await SavedRecipe.findAll({
            where: { user_id: userId },
            include: [{ model: Recipe, as: 'recipe' }],
            order: [['created_at', 'DESC']]
        });
        return savedRecords.map(sr => sr.recipe).filter(Boolean);
    }

    async findFollowedChefs(userId) {
        const followedRecords = await UserFollow.findAll({
            where: { follower_id: userId },
            include: [{
                model: User,
                as: 'following',
                include: [{ model: UserProfile, as: 'profile', required: false }]
            }]
        });
        return followedRecords.map(fr => fr.following).filter(Boolean);
    }

    async findActiveSubscription(userId) {
        // Chỉ lấy subscription còn hiệu lực: status='active' VÀ chưa hết hạn
        // (end_date NULL nghĩa là không giới hạn thời gian).
        return UserSubscription.findOne({
            where: {
                user_id: userId,
                status: 'active',
                [Op.or]: [
                    { end_date: null },
                    { end_date: { [Op.gte]: new Date() } }
                ]
            },
            include: [{ model: MembershipPlan, as: 'plan', required: false }],
            order: [['created_at', 'DESC']]
        });
    }

    // Tra cứu gói theo tên (dùng để khớp users.role -> membership_plans.name khi
    // user chưa có bản ghi user_subscriptions, ví dụ nâng cấp qua /membership/success).
    async findPlanByName(name) {
        if (!name) return null;
        return MembershipPlan.findOne({
            where: { name: { [Op.like]: name } }
        });
    }

    async searchUsers(query, excludeUserId, limit = 10) {
        const term = `%${query}%`;
        return User.findAll({
            where: {
                id: { [Op.ne]: excludeUserId },
                [Op.or]: [
                    { username: { [Op.like]: term } },
                    { '$profile.first_name$': { [Op.like]: term } },
                    { '$profile.last_name$': { [Op.like]: term } }
                ]
            },
            include: [{ model: UserProfile, as: 'profile', required: false }],
            attributes: ['id', 'username', 'role'],
            limit,
            subQuery: false,
            order: [['username', 'ASC']]
        });
    }

    async upsertProfile(userId, fields) {
        const [profile] = await UserProfile.findOrCreate({
            where: { user_id: userId },
            defaults: { user_id: userId, ...fields }
        });
        return profile.update(fields);
    }

    async updateAvatar(userId, avatarUrl) {
        const [profile] = await UserProfile.findOrCreate({
            where: { user_id: userId },
            defaults: { user_id: userId, avatar_url: avatarUrl }
        });
        return profile.update({ avatar_url: avatarUrl });
    }

    async updateEmail(userId, email) {
        const user = await User.findByPk(userId);
        if (!user) return null;
        return user.update({ email });
    }

    async findUserByEmail(email) {
        return User.findOne({ where: { email } });
    }

    async isEmailTaken(email, excludeUserId) {
        const existing = await User.findOne({ where: { email } });
        return !!(existing && existing.id !== excludeUserId);
    }

    async isRecipeSaved(userId, recipeId) {
        const existing = await SavedRecipe.findOne({ where: { user_id: userId, recipe_id: recipeId } });
        return !!existing;
    }

    async saveRecipe(userId, recipeId) {
        const [record] = await SavedRecipe.findOrCreate({
            where: { user_id: userId, recipe_id: recipeId },
            defaults: { user_id: userId, recipe_id: recipeId }
        });
        return record;
    }

    async unsaveRecipe(userId, recipeId) {
        const deletedCount = await SavedRecipe.destroy({ where: { user_id: userId, recipe_id: recipeId } });
        return deletedCount > 0;
    }

    async unfollowUser(followerId, followingId) {
        const deletedCount = await UserFollow.destroy({ where: { follower_id: followerId, following_id: followingId } });
        return deletedCount > 0;
    }
}

module.exports = new ProfileRepository();
