require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 1. IMPORT MODELS, CONTROLLERS & MIDDLEWARES
const { 
    User, 
    UserProfile, 
    Recipe, 
    SavedRecipe, 
    UserFollow, 
    UserSubscription, 
    MembershipPlan, 
    Like 
} = require('./models');

console.log("=== CHECK MODELS LOADED ===");
console.log({
    User: !!User,
    UserProfile: !!UserProfile,
    Recipe: !!Recipe,
    SavedRecipe: !!SavedRecipe,
    UserFollow: !!UserFollow,
    UserSubscription: !!UserSubscription,
    MembershipPlan: !!MembershipPlan,
    Like: !!Like
});

const v1Router = require('./routes/v1');
const apiRoutes = require('./routes');
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

// ==========================================
// VIEW ROUTES
// ==========================================

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
    // #region agent log
    fetch('http://127.0.0.1:7886/ingest/c2c9f90b-7072-482f-8d89-0e9df247861d',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e7d9b4'},body:JSON.stringify({sessionId:'e7d9b4',location:'app.js:contests/faq',message:'Rendering contest-faq view',data:{view:'contest-faq'},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion
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
app.get('/profile', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const userIncludes = [];
        
        if (UserProfile) {
            userIncludes.push({ model: UserProfile, as: 'profile', required: false });
        }
        if (UserSubscription) {
            const subInclude = {
                model: UserSubscription,
                as: 'subscription',
                required: false
            };
            
            if (MembershipPlan) {
                subInclude.include = [{ model: MembershipPlan, as: 'plan', required: false }];
            }

            userIncludes.push(subInclude);
        }
        const validIncludes = userIncludes.filter(item => item && item.model);
        
        const currentUser = await User.findByPk(userId, { 
            include: validIncludes 
        });

        if (!currentUser) {
            return res.redirect('/logout');
        }

        let recipesCount = 0, followersCount = 0, likesCount = 0;
        try {
            if (Recipe) recipesCount = await Recipe.count({ where: { user_id: userId } });
            if (UserFollow) followersCount = await UserFollow.count({ where: { following_id: userId } });
            
            if (Recipe && Like) {
                const userRecipes = await Recipe.findAll({ where: { user_id: userId }, attributes: ['id'] });
                const recipeIds = userRecipes.map(r => r.id);
                if (recipeIds.length > 0) {
                    likesCount = await Like.count({ where: { target_id: recipeIds, target_type: 'recipe' } });
                }
            }
        } catch (err) {
            console.warn("Cảnh báo stats query:", err.message);
        }

        let myRecipes = [], savedRecipes = [], favoriteRecipes = [];
        try {
            if (Recipe) {
                myRecipes = await Recipe.findAll({ where: { user_id: userId }, order: [['created_at', 'DESC']] });
            }
            if (SavedRecipe && Recipe) {
                const savedRecords = await SavedRecipe.findAll({
                    where: { user_id: userId },
                    include: [{ model: Recipe, as: 'recipe' }]
                });
                savedRecipes = savedRecords.map(sr => sr.recipe).filter(Boolean);
            }
            if (Like && Recipe) {
                const favoriteRecords = await Like.findAll({ where: { user_id: userId, target_type: 'recipe' } });
                const favIds = favoriteRecords.map(f => f.target_id);
                if (favIds.length > 0) {
                    favoriteRecipes = await Recipe.findAll({ where: { id: favIds } });
                }
            }
        } catch (err) {
            console.warn("Cảnh báo recipe query:", err.message);
        }

        let followedChefs = [];
        try {
            if (UserFollow && User) {
                const followedRecords = await UserFollow.findAll({
                    where: { follower_id: userId },
                    include: [{ 
                        model: User, 
                        as: 'following',
                        include: UserProfile ? [{ model: UserProfile, as: 'profile' }] : []
                    }]
                });
                followedChefs = followedRecords.map(fr => fr.following).filter(Boolean);
            }
        } catch (err) {
            console.warn("Cảnh báo followed chefs query:", err.message);
        }

        const profile = currentUser.profile || {};
        const subscription = currentUser.subscription || null;

        const fullUserData = {
            id: currentUser.id,
            email: currentUser.email,
            username: currentUser.username || currentUser.email.split('@')[0],
            role: (currentUser.role || 'free').toLowerCase(),
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            bio: profile.biography || '',
            cookingStyle: profile.cooking_style || 'Modern Gastronomy',
            location: profile.location || 'Not Specified',
            website: profile.website || '',
            avatarUrl: profile.avatar_url || ''
        };

        res.render('profile', { 
            user: fullUserData, 
            subscription: subscription,
            stats: { recipesCount, followersCount, likesCount },
            recipes: { my: myRecipes, saved: savedRecipes, favorite: favoriteRecipes },
            followedChefs: followedChefs
        });

    } catch (error) {
        console.error("Lỗi chi tiết khi tải trang Profile:", error);
        res.status(500).send("Đã xảy ra lỗi khi tải dữ liệu người dùng: " + error.message);
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

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;