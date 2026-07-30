// src/controllers/profile.controller.js
const { User, UserProfile, Recipe } = require('../models');

module.exports = {
    // 1. Render Dashboard
    async getDashboard(req, res) {
        const userId = res.locals.user.id;
        const currentUser = await User.findByPk(userId, { include: [{ model: UserProfile, as: 'profile' }] });
        const recipesCount = await Recipe.count({ where: { user_id: userId } });

        res.render('profile/dashboard', {
            user: { ...currentUser.toJSON(), ...currentUser.profile },
            stats: { recipesCount, followersCount: '8.4k' },
            activeTab: 'dashboard'
        });
    },

    // 2. Render Recipes
    async getRecipes(req, res) {
        const userId = res.locals.user.id;
        const currentUser = await User.findByPk(userId, { include: [{ model: UserProfile, as: 'profile' }] });
        const myRecipes = await Recipe.findAll({ where: { user_id: userId } });

        res.render('profile/recipes', {
            user: { ...currentUser.toJSON(), ...currentUser.profile },
            myRecipes,
            activeTab: 'recipes'
        });
    },

    // 3. Render Subscription
    async getSubscription(req, res) {
        const userId = res.locals.user.id;
        const currentUser = await User.findByPk(userId, { include: [{ model: UserProfile, as: 'profile' }] });

        res.render('profile/subscription', {
            user: { ...currentUser.toJSON(), ...currentUser.profile },
            activeTab: 'subscription'
        });
    },

    // 4. Render Settings
    async getSettings(req, res) {
        const userId = res.locals.user.id;
        const currentUser = await User.findByPk(userId, { include: [{ model: UserProfile, as: 'profile' }] });

        res.render('profile/settings', {
            user: { ...currentUser.toJSON(), ...currentUser.profile },
            activeTab: 'settings'
        });
    }
};