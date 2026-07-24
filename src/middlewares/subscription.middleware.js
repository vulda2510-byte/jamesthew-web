// src/middlewares/subscription.middleware.js

/**
 * Middleware kiểm tra quyền Premium hoặc VIP
 * Khóa chặn những User chỉ có role là 'free'
 */
const requirePremium = (req, res, next) => {
    // Tùy theo cách bạn lưu user (session hoặc res.locals)
    const user = req.session?.user || req.user;

    if (!user) {
        // Chưa đăng nhập thì đá về trang Login
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({ success: false, message: 'Please login to continue.' });
        }
        return res.redirect(`/login?redirect=${req.originalUrl}`);
    }

    // Các Role được phép truy cập tính năng Premium
    const allowedRoles = ['premium', 'vip', 'admin'];

    if (!allowedRoles.includes(user.role)) {
        // Có tài khoản nhưng là 'free', chặn lại và chuyển tới bảng giá
        if (req.originalUrl.startsWith('/api')) {
            return res.status(403).json({ 
                success: false, 
                message: 'This feature requires a Premium membership. Please upgrade your account.' 
            });
        }
        // Đá về trang Membership để mồi chài họ mua gói
        return res.redirect('/membership');
    }

    // Hợp lệ -> cho đi tiếp
    next();
};

/**
 * Middleware kiểm tra quyền VIP (Chỉ VIP và Admin mới được vào)
 */
const requireVIP = (req, res, next) => {
    const user = req.session?.user || req.user;
    
    if (!user || !['vip', 'admin'].includes(user.role)) {
        return res.redirect('/membership');
    }
    next();
};

module.exports = {
    requirePremium,
    requireVIP
};