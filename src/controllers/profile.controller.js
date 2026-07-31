// src/controllers/profile.controller.js
const profileService = require('../services/profile.service');

module.exports = {
    // 1. Dashboard: profile overview stats + bio card + followed chefs
    async getDashboard(req, res, next) {
        try {
            const userId = res.locals.user.id;
            const data = await profileService.getDashboardData(userId);
            if (!data) return res.redirect('/logout');

            const followedChefs = await profileService.getFollowedChefs(userId);

            res.render('profile/dashboard', {
                ...data,
                followedChefs,
                activeTab: 'dashboard'
            });
        } catch (error) {
            console.error('profile.controller.getDashboard error:', error);
            next(error);
        }
    },

    // 2. Recipes: My Recipes & Saved Recipes
    async getRecipes(req, res, next) {
        try {
            const userId = res.locals.user.id;
            const data = await profileService.getRecipesData(userId);
            if (!data) return res.redirect('/logout');

            res.render('profile/recipes', {
                ...data,
                activeTab: 'recipes'
            });
        } catch (error) {
            console.error('profile.controller.getRecipes error:', error);
            next(error);
        }
    },

    // 3. Subscription details
    async getSubscription(req, res, next) {
        try {
            const userId = res.locals.user.id;
            const data = await profileService.getSubscriptionData(userId);
            if (!data) return res.redirect('/logout');

            res.render('profile/subscription', {
                ...data,
                activeTab: 'subscription'
            });
        } catch (error) {
            console.error('profile.controller.getSubscription error:', error);
            next(error);
        }
    },

    // 4. Account settings (profile info, email, password)
    async getSettings(req, res, next) {
        try {
            const userId = res.locals.user.id;
            const data = await profileService.getSettingsData(userId);
            if (!data) return res.redirect('/logout');

            res.render('profile/settings', {
                ...data,
                activeTab: 'settings'
            });
        } catch (error) {
            console.error('profile.controller.getSettings error:', error);
            next(error);
        }
    }
};
