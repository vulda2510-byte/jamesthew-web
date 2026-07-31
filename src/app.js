require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 1. IMPORT MODELS, CONTROLLERS & MIDDLEWARES
const { User } = require('./models');

const v1Router = require('./routes/v1');
const apiRoutes = require('./routes');
const profileRoutes = require('./routes/profile.routes');
const healthController = require('./controllers/health.controller');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const { requireAuth, requireGuest, authorize } = require('./middlewares/auth.middleware');
const logger = require('./config/logger');

// KHỞI TẠO APP
const app = express();

// 2. CONFIGURE VIEW ENGINE & STATIC FILES
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// 3. BODY PARSERS & COOKIE PARSER (BẮT BUỘC ĐẶT TRƯỚC ROUTES)
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
            if (logger && logger.error) {
                logger.error("Token invalid or expired");
            }
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});
// VIEW ROUTES

// --- A. Public Pages ---
app.get('/', (req, res) => res.render('home'));
app.get('/recipes', (req, res) => res.render('recipes'));
app.get('/recipes/detail/:id', (req, res) => {
    res.render('recipe-detail', { recipeId: req.params.id }); 
});
app.get('/recipes/:id', (req, res) => {
    res.render('recipe-detail', { recipeId: req.params.id }); 
});
app.get('/membership', (req, res) => res.render('membership'));

app.get('/contests', (req, res) => {
    res.render('contests', { title: 'Contests Hub' });
});

app.get('/contests/list', (req, res) => {
    res.render('contests-list', { title: 'All Contests' });
});

app.get('/contests/detail/:id', (req, res) => {
    res.render('contest-detail', { title: 'Contest Detail', contestId: req.params.id });
});

app.get('/contests/faq', (req, res) => {
    res.render('contest-faq', { title: 'Contest FAQs' });
});

app.get('/contests/rules', (req, res) => {
    res.render('contest-rules', { title: 'Contest Rules' });
});

app.get('/faq', (req, res) => res.redirect('/contests/faq'));
app.get('/rules', (req, res) => res.redirect('/contests/rules'));

app.get('/contests/winners', (req, res) => {
    res.render('winners', { title: 'Contest Winners' });
});

// --- B. Authentication & Session Routes ---
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.get('/api/v1/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.get('/login', requireGuest, (req, res) => res.render('login'));
app.get('/register', requireGuest, (req, res) => res.render('register'));

// --- C. Protected User Profile & Dashboard ---

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
            unitAmount = 999;
            productName = 'Premium Membership - Monthly';
        } else if (plan === 'vip') {
            unitAmount = 2499;
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
            customer_email: res.locals.user ? res.locals.user.email : undefined,
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

// --- E. Role-Protected Pages ---
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

// MOUNT ROUTERS
app.use('/api/v1', v1Router);
if (apiRoutes) {
    app.use('/api', apiRoutes);
}
app.use(profileRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;