// src/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 1. IMPORT MODELS, CONTROLLERS & MIDDLEWARES (Tập trung ở đầu file)
const { User, UserProfile, Recipe } = require('./models');
const apiRoutes = require('./routes');
const healthController = require('./controllers/health.controller');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const { requireAuth, requireGuest, authorize } = require('./middlewares/auth.middleware');
const logger = require('./config/logger');
const { requireContestAccess } = require('./middlewares/contestAuth.middleware');
const app = express();

// 2. CONFIGURE VIEW ENGINE & STATIC FILES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// 3. BODY PARSERS & COOKIE PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. GLOBAL AUTHENTICATION STATE MIDDLEWARE
app.use((req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret'); 
            res.locals.user = decoded; 
        } catch (err) {
            logger.error("Token invalid or expired");
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// ==========================================
// VIEW ROUTES
// ==========================================

// --- A. Public Pages (Ai cũng xem được) ---
app.get('/', (req, res) => res.render('home'));
app.get('/recipes', (req, res) => res.render('recipes'));
app.get('/recipes/detail/:id', (req, res) => {
    // Render file recipe-detail.ejs và truyền kèm ID để frontend dùng gọi API
    res.render('recipe-detail', { recipeId: req.params.id }); 
});
// BỔ SUNG THÊM ROUTE NÀY (Hỗ trợ trang Home /recipes/...)
app.get('/recipes/:id', (req, res) => {
    res.render('recipe-detail', { recipeId: req.params.id }); 
});
app.get('/membership', (req, res) => res.render('membership'));

app.get('/contests', (req, res) => {
    res.render('contests', { title: 'Contests Hub' }); // File số 4
});

app.get('/contests/list', (req, res) => {
    res.render('contests-list', { title: 'All Contests' }); // File số 7
});

app.get('/contests/detail/:id', (req, res) => {
    // Truyền ID từ URL vào EJS để frontend JS gọi API (File số 8)
    res.render('contest-detail', { title: 'Contest Detail', contestId: req.params.id });
});

app.get('/contests/faq', (req, res) => {
    res.render('faq', { title: 'Contest FAQs' }); // File số 9
});

app.get('/contests/rules', (req, res) => {
    res.render('rules', { title: 'Contest Rules' }); // File số 10
});

app.get('/contests/winners', (req, res) => {
    res.render('winners', { title: 'Contest Winners' }); // File số 11
});
// Route xử lý Đăng xuất
app.get('/logout', (req, res) => {
    // 1. Xóa cookie token hiện tại
    res.clearCookie('token');
    
    // 2. Chuyển hướng người dùng về trang Login
    res.redirect('/login');
});

// Giữ thêm route này phòng trường hợp vẫn gọi theo đường dẫn cũ
app.get('/api/v1/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});
// --- B. Guest Pages (Chỉ dành cho người chưa đăng nhập) ---
app.get('/login', requireGuest, (req, res) => res.render('login'));
app.get('/register', requireGuest, (req, res) => res.render('register'));
// Route render trang Profile cá nhân
app.get('/profile', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;

        // Truy vấn User cùng Profile
        const currentUser = await User.findByPk(userId, {
            include: [{ model: UserProfile, as: 'profile' }]
        });

        if (!currentUser) {
            return res.redirect('/logout');
        }

        // Thống kê đếm dữ liệu thực tế
        let recipesCount = 0;
        try {
            if (Recipe) {
                recipesCount = await Recipe.count({ where: { user_id: userId } });
            }
        } catch (err) {
            console.warn("Lỗi đếm công thức:", err.message);
        }

        const profile = currentUser.profile || {};

        // Chuẩn hóa Role về chữ thường
        const userRole = currentUser.role ? currentUser.role.toLowerCase() : 'free';

        const fullUserData = {
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.username || 'chef_member',
            role: userRole,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            bio: profile.biography || '',
            cookingStyle: profile.cooking_style || 'Modern Gastronomy',
            location: profile.location || 'Hanoi, Vietnam',
            avatarUrl: profile.avatar_url || ''
        };

        res.render('profile', { 
            user: fullUserData, 
            stats: { 
                recipesCount: recipesCount,
                followersCount: 0,
                likesCount: 0
            } 
        });

    } catch (error) {
        console.error("Lỗi khi tải trang Profile:", error);
        res.status(500).send("Đã xảy ra lỗi khi tải dữ liệu người dùng.");
    }
});
app.get('/dashboard', requireAuth, (req, res) => res.render('dashboard'));

// --- D. Membership & Stripe Checkout Routes ---
app.get('/membership/checkout', requireAuth, (req, res) => {
    const plan = req.query.plan || 'premium'; 
    res.render('checkout', { 
        title: 'Checkout - James Thew',
        plan: plan 
    });
});

app.post('/membership/create-checkout-session', requireAuth, async (req, res, next) => {
    try {
        const { plan } = req.body;
        let unitAmount = 0;
        let productName = '';

        if (plan === 'premium') {
            unitAmount = 999; // $9.99
            productName = 'Premium Membership - Monthly';
        } else if (plan === 'vip') {
            unitAmount = 2499; // $24.99
            productName = 'VIP Membership - Monthly';
        } else {
            return res.redirect('/membership');
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                            description: 'Unlock exclusive culinary experiences on James Thew.',
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/membership/success?plan=${plan}`,
            cancel_url: `${req.protocol}://${req.get('host')}/membership/checkout?plan=${plan}`,
            customer_email: res.locals.user.email,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error('Lỗi khi tạo Stripe Session:', error);
        res.status(500).send('Đã có lỗi xảy ra khi kết nối thanh toán.');
    }
});

app.get('/membership/success', requireAuth, async (req, res, next) => {
    try {
        const plan = req.query.plan || 'premium';

        // Cập nhật Role của User trực tiếp trong Database
        await User.update(
            { role: plan },
            { where: { id: res.locals.user.id } }
        );

        res.render('checkout-success', { 
            title: 'Membership Upgraded - James Thew',
            plan: plan
        });
    } catch (error) {
        console.error('Lỗi khi nâng cấp Membership:', error);
        next(error);
    }
});

// --- E. Role-Protected Pages (Phân quyền theo Role) ---
app.get('/recipes/premium-exclusive', authorize('premium', 'vip'), (req, res) => {
    res.render('premium-recipes');
});

app.get('/vip-masterclass', authorize('vip'), (req, res) => {
    res.render('vip-masterclass');
});

app.get('/admin/dashboard', authorize('admin'), (req, res) => {
    res.render('admin/dashboard');
});

// ==========================================
// API ROUTES & ERROR HANDLERS
// ==========================================
app.get('/health', healthController.getHealth);
app.use('/api', apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;