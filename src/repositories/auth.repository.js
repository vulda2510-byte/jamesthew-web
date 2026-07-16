// src/repositories/auth.repository.js
const User = require('../models/user.model');

class AuthRepository {
    async findUserForLogin(email) {
        return null;
    }

    async createUser(userData) {
        return null;
    }

    async getUserProfile(userId) {
        return null;
    }
}

module.exports = new AuthRepository();