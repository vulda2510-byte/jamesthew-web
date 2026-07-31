// src/routes/profile.routes.js
const express = require('express');
const profileController = require('../controllers/profile.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/profile', requireAuth, (req, res) => res.redirect('/profile/dashboard'));
router.get('/profile/dashboard', requireAuth, profileController.getDashboard);
router.get('/profile/recipes', requireAuth, profileController.getRecipes);
router.get('/profile/subscription', requireAuth, profileController.getSubscription);
router.get('/profile/settings', requireAuth, profileController.getSettings);

module.exports = router;
