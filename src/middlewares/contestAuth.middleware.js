const { DailyLimit } = require('../models');

/**
 * Middleware 1: Chặn Guest xem các trang chi tiết, Rules, FAQ
 */
const requireContestAccess = (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        // Nếu là Guest -> Chuyển hướng về trang login hoặc báo lỗi tùy giao diện
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware 2: Kiểm tra giới hạn hành động trong ngày (Rate Limiting theo Role)
 * @param {String} actionType - 'faq_ask', 'comment', hoặc 'contest_create'
 */
const checkDailyLimit = (actionType) => {
    return async (req, res, next) => {
        try {
            const user = res.locals.user;
            if (!user) {
                return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để thực hiện thao tác này.' });
            }

            const role = user.role || 'free';
            const today = new Date().toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

            // Admin và VIP (đối với comment/FAQ) được miễn phí giới hạn
            if (role === 'admin') return next();

            // Định nghĩa hạn mức tối đa cho từng Role
            const LIMITS = {
                faq_ask: { free: 3, premium: 20, vip: 9999 },
                comment: { free: 5, premium: 50, vip: 9999 },
                contest_create: { free: 0, premium: 1, vip: 3 } // VIP tối đa 3 contest/ngày
            };

            const maxAllowed = LIMITS[actionType]?.[role] ?? 0;

            if (maxAllowed === 0) {
                return res.status(403).json({ 
                    success: false, 
                    message: `Tài khoản hạng ${role.toUpperCase()} không có quyền thực hiện hành động này. Hãy nâng cấp tài khoản!` 
                });
            }

            // Kiểm tra số lần đã thực hiện trong CSDL hôm nay
            let record = await DailyLimit.findOne({
                where: {
                    user_id: user.id,
                    action_type: actionType,
                    action_date: today
                }
            });

            const currentCount = record ? record.count : 0;

            if (currentCount >= maxAllowed) {
                return res.status(429).json({
                    success: false,
                    message: `Bạn đã đạt giới hạn tối đa (${maxAllowed} lần/ngày) cho hành động này. Hãy quay lại vào ngày mai!`
                });
            }

            // Gắn thông tin record vào req để Controller dùng tăng count sau khi thành công
            req.dailyLimitRecord = record;
            req.todayDate = today;

            next();
        } catch (error) {
            console.error('Lỗi kiểm tra Daily Limit:', error);
            next(error);
        }
    };
};

/**
 * Hàm Helper: Tăng số đếm lượt sử dụng sau khi User thực hiện hành động thành công
 */
const incrementDailyLimit = async (userId, actionType, todayDate, existingRecord) => {
    if (existingRecord) {
        await existingRecord.increment('count', { by: 1 });
    } else {
        await DailyLimit.create({
            user_id: userId,
            action_type: actionType,
            action_date: todayDate,
            count: 1
        });
    }
};

module.exports = {
    requireContestAccess,
    checkDailyLimit,
    incrementDailyLimit
};