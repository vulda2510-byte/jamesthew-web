// src/routes/v1/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.routes');
const recipeRoutes = require('./recipe.routes');
const stripeRoutes = require('./stripe.route'); // Bổ sung dòng này
const contestRoutes = require('./contest.routes'); // Hoặc require('./contest.routes') tùy vị trí file
const faqRoutes = require('./faqs.routes');
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);
router.use('/stripe', stripeRoutes); // Bổ sung dòng này
router.use('/contests', contestRoutes);
router.use('/faqs', faqRoutes);
module.exports = router;