const express = require('express');
const contestController = require('../../controllers/contest.controller');
const { requireContestAccess, checkDailyLimit } = require('../../middlewares/contestAuth.middleware');
const { authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// Public / General List
router.get('/', contestController.getAll);
router.get('/winners', contestController.getWinners);
router.get('/:id', contestController.getById);

// Protected Actions (Member trở lên)
router.post('/', requireContestAccess, checkDailyLimit('contest_create'), contestController.create);
router.post('/:id/submit', requireContestAccess, contestController.submitEntry);
router.post('/like', requireContestAccess, contestController.toggleLike);
router.post('/comments', requireContestAccess, checkDailyLimit('comment'), contestController.addComment);

// Admin Only
router.patch('/:id/ban', requireContestAccess, authorize('admin'), contestController.toggleBan);

module.exports = router;