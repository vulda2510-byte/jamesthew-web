const express = require('express');
const faqController = require('../../controllers/faq.controller');
const { requireContestAccess, checkDailyLimit } = require('../../middlewares/contestAuth.middleware');
const { authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', faqController.getAll);
router.post('/', requireContestAccess, checkDailyLimit('faq_ask'), faqController.ask);
router.patch('/:id/answer', requireContestAccess, authorize('admin'), faqController.answer);

module.exports = router;