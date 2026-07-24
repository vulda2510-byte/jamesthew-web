// src/routes/v1/stripe.route.js
const express = require('express');
const router = express.Router();
const stripeController = require('../../controllers/stripe.controller');
const { protectView } = require('../../middlewares/auth.middleware'); // Chỉ cho phép user đã login mua hàng

router.post('/create-checkout-session', protectView, stripeController.createCheckoutSession);

module.exports = router;