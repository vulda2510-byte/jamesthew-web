// src/services/auth.service.js
const authRepository = require('../repositories/auth.repository');
// src/services/auth.service.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ where: { email } });
        return user;
    } catch (error) {
        throw error;
    }
};

const register = async (userData) => {
    try {
        const { email, password, username } = userData;

        // 1. Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            const error = new Error('Email này đã được sử dụng.');
            error.status = 400;
            throw error;
        }

        // 2. Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Lưu vào Database (Chỉ chèn các cột thực sự có trong bảng users)
        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            username: username || email.split('@')[0],
            account_status: 'active'
        });

        return { 
            message: 'Đăng ký tài khoản thành công!',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username
            }
        };
    } catch (error) {
        throw error;
    }
};

const login = async (credentials) => {
    return { message: "Login endpoint ready" };
};

const logout = async () => {
    return { message: "Logout endpoint ready" };
};

const getProfile = async (userId) => {
    return { message: "Profile endpoint ready" };
};

module.exports = {
    login,
    register,
    logout,
    getUserByEmail,
    getProfile
};