// src/middlewares/auth.middleware.js
const { User } = require('../models');

// 1. Yêu cầu đăng nhập & Tự động làm mới dữ liệu User từ DB
const requireAuth = async (req, res, next) => {
    try {
        if (!res.locals.user) {
            return res.redirect('/login');
        }

        // Lấy thông tin User mới nhất từ Database
        const dbUser = await User.findByPk(res.locals.user.id);
        if (!dbUser) {
            res.clearCookie('token'); // Xóa cookie nếu user không còn tồn tại trong DB
            return res.redirect('/login');
        }

        // Cập nhật dữ liệu mới nhất vào res.locals.user cho các View EJS
        res.locals.user = dbUser.toJSON();
        req.user = res.locals.user;
        next();
    } catch (error) {
        console.error('Lỗi kiểm tra xác thực (requireAuth):', error);
        next(error);
    }
};

// 1b. Bản JSON cho API routes: trả 401 JSON thay vì redirect sang /login
// (requireAuth ném 302 HTML ngay cả cho request fetch(), khiến `await res.json()` phía client bị lỗi)
const requireAuthApi = async (req, res, next) => {
    try {
        if (!res.locals.user) {
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        const dbUser = await User.findByPk(res.locals.user.id);
        if (!dbUser) {
            res.clearCookie('token');
            return res.status(401).json({ success: false, message: 'Not signed in.' });
        }

        res.locals.user = dbUser.toJSON();
        req.user = res.locals.user;
        next();
    } catch (error) {
        console.error('Lỗi kiểm tra xác thực (requireAuthApi):', error);
        res.status(500).json({ success: false, message: 'Authentication check failed.' });
    }
};

// 2. Yêu cầu chưa đăng nhập (Dành cho trang Login / Register)
const requireGuest = (req, res, next) => {
    if (res.locals.user) {
        return res.redirect('/');
    }
    next();
};

// 3. Phân quyền theo danh sách Role (Free, Premium, VIP, Admin)
const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!res.locals.user) {
                return res.redirect('/login');
            }

            const dbUser = await User.findByPk(res.locals.user.id);
            if (!dbUser) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            res.locals.user = dbUser.toJSON();
            const currentRole = dbUser.role || 'free';

            // Admin có quyền tối cao
            if (currentRole === 'admin') {
                return next();
            }

            // Kiểm tra Role người dùng có nằm trong danh sách cho phép không
            if (allowedRoles.includes(currentRole)) {
                return next();
            }

            // Nếu không đủ quyền -> Trả về giao diện lỗi 403
            return res.status(403).render('error', {
                title: 'Access Denied - James Thew',
                message: 'Bạn cần nâng cấp gói tài khoản để truy cập nội dung này!'
            });

        } catch (error) {
            console.error('Lỗi khi kiểm tra phân quyền (authorize):', error);
            next(error);
        }
    };
};

// Biến protectView thành alias (tên gọi khác) của requireAuth để giữ tính tương thích nếu đã import ở nơi khác
const protectView = requireAuth;

module.exports = {
    requireAuth,
    requireAuthApi,
    requireGuest,
    authorize,
    protectView
};