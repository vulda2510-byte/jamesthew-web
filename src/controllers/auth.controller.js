// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // BỔ SUNG DÒNG NÀY (Hoặc 'bcryptjs' tùy thư viện bạn cài)
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // 1. Logic kiểm tra user và password của bạn ở đây...
    if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ email và mật khẩu'
            });
        }

        // 1.2 Tìm user trong Database
        const user = await authService.getUserByEmail(email);

        // Nếu không tìm thấy user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // 1.3 Kiểm tra mật khẩu có khớp không
        // SỬA Ở ĐÂY: Thay user.password thành user.password_hash
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }
        // 2. TẠO JWT TOKEN (Bắt buộc dùng chung một Secret key với app.js)
        const secretKey = process.env.JWT_SECRET || 'your_fallback_secret';
        
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                role: user.role || 'free',
                firstName: user.firstName, // Đã bổ sung
                lastName: user.lastName    // Đã bổ sung
            },
            secretKey,
            { expiresIn: '1d' }
        );

        // 3. SET COOKIE ĐỂ SERVER ĐỌC ĐƯỢC CHO EJS
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        });

        // 4. Trả về kết quả cho file login.js ở frontend
        return res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            token: token // Nếu frontend muốn lưu localStorage dự phòng
        });

    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        // Xóa cookie chứa token
        res.clearCookie('token');
        
        // Trả về JSON nếu gọi qua fetch, hoặc redirect nếu gọi trực tiếp
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(200).json({ success: true, message: 'Logged out' });
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const result = await authService.getProfile();
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
    logout,
    getProfile
};