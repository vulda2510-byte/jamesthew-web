'use strict';
const bcrypt = require('bcrypt');
const profileRepository = require('../repositories/profile.repository');

class ProfileService {
    // Chuẩn hóa dữ liệu User + Profile thành 1 object phẳng cho view.
    // Không dùng fallback bịa dữ liệu (vd "Modern Gastronomy", "Hanoi, Vietnam") -
    // để trống thì view tự hiển thị "Not Specified".
    normalizeUser(currentUser) {
        const profile = currentUser.profile || {};
        return {
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.username || currentUser.email.split('@')[0],
            role: (currentUser.role || 'free').toLowerCase(),
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            bio: profile.biography || '',
            cookingStyle: profile.cooking_style || '',
            location: profile.location || '',
            website: profile.website || '',
            phone: profile.phone || '',
            avatarUrl: profile.avatar_url || ''
        };
    }

    async getCurrentUser(userId) {
        const currentUser = await profileRepository.findUserWithProfile(userId);
        if (!currentUser) return null;
        return this.normalizeUser(currentUser);
    }

    async getStats(userId) {
        const [recipesCount, followersCount, likesCount, savedCount] = await Promise.all([
            profileRepository.countRecipes(userId),
            profileRepository.countFollowers(userId),
            profileRepository.countLikesOnUserRecipes(userId),
            profileRepository.countSaved(userId)
        ]);
        return { recipesCount, followersCount, likesCount, savedCount };
    }

    // NGUỒN SỰ THẬT DUY NHẤT cho cấp thành viên.
    // Sidebar badge và trang Subscription đều dùng hàm này nên không bao giờ lệch nhau.
    //
    // Thứ tự ưu tiên (toàn bộ đều là dữ liệu thật trong DB):
    //   1. Bản ghi user_subscriptions còn hiệu lực (kèm membership_plans)
    //   2. Nếu chưa có bản ghi (vd. nâng cấp qua /membership/success chỉ set users.role),
    //      tra membership_plans theo tên khớp users.role
    //   3. Nếu role không khớp gói nào (vd. 'admin'), hiển thị chính role đó
    async resolveMembership(userId, role) {
        const subscription = await profileRepository.findActiveSubscription(userId);

        if (subscription && subscription.plan) {
            return {
                planName: subscription.plan.name,
                price: subscription.plan.price,
                billingCycle: subscription.plan.billing_cycle,
                features: subscription.plan.features || [],
                status: subscription.status,
                startDate: subscription.start_date,
                endDate: subscription.end_date,
                autoRenew: subscription.auto_renew,
                hasSubscriptionRecord: true
            };
        }

        const planFromRole = await profileRepository.findPlanByName(role);
        if (planFromRole) {
            return {
                planName: planFromRole.name,
                price: planFromRole.price,
                billingCycle: planFromRole.billing_cycle,
                features: planFromRole.features || [],
                status: 'active',
                startDate: null,
                endDate: null,
                autoRenew: null,
                hasSubscriptionRecord: false
            };
        }

        return {
            planName: (role || 'free').toUpperCase(),
            price: null,
            billingCycle: null,
            features: [],
            status: 'active',
            startDate: null,
            endDate: null,
            autoRenew: null,
            hasSubscriptionRecord: false
        };
    }

    async searchUsers(query, currentUserId) {
        const term = (query || '').trim();
        if (term.length < 2) return [];

        const users = await profileRepository.searchUsers(term, currentUserId);
        return users.map(u => {
            const profile = u.profile || {};
            const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
            return {
                id: u.id,
                username: u.username,
                fullName,
                role: (u.role || 'free').toLowerCase(),
                avatarUrl: profile.avatar_url || ''
            };
        });
    }

    async getDashboardData(userId) {
        const user = await this.getCurrentUser(userId);
        if (!user) return null;
        const [stats, membership] = await Promise.all([
            this.getStats(userId),
            this.resolveMembership(userId, user.role)
        ]);
        return { user, stats, membership };
    }

    async getRecipesData(userId) {
        const user = await this.getCurrentUser(userId);
        if (!user) return null;
        const [stats, membership, myRecipes, savedRecipes] = await Promise.all([
            this.getStats(userId),
            this.resolveMembership(userId, user.role),
            profileRepository.findMyRecipes(userId),
            profileRepository.findSavedRecipes(userId)
        ]);
        return {
            user,
            stats,
            membership,
            recipes: { my: myRecipes, saved: savedRecipes }
        };
    }

    async getSubscriptionData(userId) {
        const user = await this.getCurrentUser(userId);
        if (!user) return null;
        const [stats, membership] = await Promise.all([
            this.getStats(userId),
            this.resolveMembership(userId, user.role)
        ]);
        return { user, stats, membership };
    }

    async getSettingsData(userId) {
        const user = await this.getCurrentUser(userId);
        if (!user) return null;
        const [stats, membership] = await Promise.all([
            this.getStats(userId),
            this.resolveMembership(userId, user.role)
        ]);
        return { user, stats, membership };
    }

    async getFollowedChefs(userId) {
        return profileRepository.findFollowedChefs(userId);
    }

    async updateProfile(userId, fields) {
        const { firstName, lastName, bio, cookingStyle, location, website, phone } = fields;
        await profileRepository.upsertProfile(userId, {
            first_name: firstName ?? '',
            last_name: lastName ?? '',
            biography: bio ?? '',
            cooking_style: cookingStyle ?? '',
            location: location ?? '',
            website: website ?? '',
            phone: phone ?? ''
        });
        return { success: true };
    }

    async updateEmail(userId, email) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            const err = new Error('Please provide a valid email address.');
            err.status = 400;
            throw err;
        }
        const taken = await profileRepository.isEmailTaken(email, userId);
        if (taken) {
            const err = new Error('This email is already in use.');
            err.status = 409;
            throw err;
        }
        await profileRepository.updateEmail(userId, email);
        return { success: true };
    }

    async changePassword(userId, { currentPassword, newPassword, confirmNewPassword }) {
        if (!currentPassword) {
            const err = new Error('Current password is required.');
            err.status = 400;
            throw err;
        }
        if (!newPassword || newPassword.length < 8) {
            const err = new Error('New password must be at least 8 characters long.');
            err.status = 400;
            throw err;
        }
        if (newPassword !== confirmNewPassword) {
            const err = new Error('Password confirmation does not match.');
            err.status = 400;
            throw err;
        }

        const user = await profileRepository.findUserById(userId);
        if (!user) {
            const err = new Error('User not found.');
            err.status = 404;
            throw err;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            const err = new Error('Current password is incorrect.');
            err.status = 400;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password_hash: hashedPassword });
        return { success: true };
    }

    async updateAvatar(userId, avatarUrl) {
        await profileRepository.updateAvatar(userId, avatarUrl);
        return { success: true, avatarUrl };
    }

    async toggleSaveRecipe(userId, recipeId, action) {
        if (action === 'unsave') {
            await profileRepository.unsaveRecipe(userId, recipeId);
            return { success: true, saved: false };
        }
        await profileRepository.saveRecipe(userId, recipeId);
        return { success: true, saved: true };
    }

    async isRecipeSaved(userId, recipeId) {
        return profileRepository.isRecipeSaved(userId, recipeId);
    }

    async unfollowUser(followerId, followingId) {
        await profileRepository.unfollowUser(followerId, followingId);
        return { success: true };
    }
}

module.exports = new ProfileService();
