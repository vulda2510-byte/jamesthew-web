'use strict';
const contestService = require('../services/contest.service');

class ContestController {
  async getAll(req, res) {
    try {
      const result = await contestService.getAllContests(req.query);
      return res.status(200).json({ success: true, data: result.rows, total: result.count });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const contest = await contestService.getContestById(req.params.id);
      return res.status(200).json({ success: true, data: contest });
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const dailyMeta = { todayDate: req.todayDate, record: req.dailyLimitRecord };
      const contest = await contestService.createContest(req.body, res.locals.user, dailyMeta);
      return res.status(201).json({ success: true, data: contest });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async submitEntry(req, res) {
    try {
      const submission = await contestService.submitEntry(req.params.id, req.body, res.locals.user.id);
      return res.status(201).json({ success: true, data: submission });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleLike(req, res) {
    try {
      const { targetId, targetType } = req.body;
      const result = await contestService.toggleLike(res.locals.user.id, targetId, targetType);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async addComment(req, res) {
    try {
      const dailyMeta = { todayDate: req.todayDate, record: req.dailyLimitRecord };
      const comment = await contestService.addComment(req.body, res.locals.user.id, dailyMeta);
      return res.status(201).json({ success: true, data: comment });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getWinners(req, res) {
    try {
      const winners = await contestService.getWinners(req.query);
      return res.status(200).json({ success: true, data: winners.rows, total: winners.count });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async toggleBan(req, res) {
    try {
      const contest = await contestService.toggleBanContest(req.params.id, req.body.reason);
      return res.status(200).json({ success: true, data: contest });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
exports.getContests = async (req, res) => {
  try {
    const { type, scale, search } = req.query;
    const contests = await contestService.getContests({ type, scale, search });
    res.json({ success: true, data: contests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getContestDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findByPk(id, {
      include: [
        { model: ContestSubmission, as: 'submissions', include: [{ model: User, as: 'participant', attributes: ['username'] }] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'author', attributes: ['username', 'role'] }] }
      ]
    });

    if (!contest) return res.status(404).json({ success: false, message: 'Không tìm thấy cuộc thi' });
    res.json({ success: true, data: contest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createContest = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Logic: Small contest dành cho Premium/VIP/Admin; Large contest chỉ dành cho VIP/Admin
    if (req.body.scale === 'large' && !['vip', 'admin'].includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Quy mô cuộc thi Lớn (Large) chỉ dành cho VIP hoặc Admin.' });
    }

    const newContest = await Contest.create({
      ...req.body,
      slug: req.body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      author_id: userId,
      status: 'upcoming'
    });

    res.status(201).json({ success: true, data: newContest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.submitEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await ContestSubmission.create({
      contest_id: id,
      user_id: req.user.id,
      title: req.body.title,
      image_url: req.body.image_url,
      content: req.body.content
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.toggleLike = async (req, res) => {
  try {
    const { targetId } = req.body;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ where: { user_id: userId, target_id: targetId } });
    
    if (existingLike) {
      await existingLike.destroy();
    } else {
      await Like.create({ user_id: userId, target_id: targetId, target_type: 'contest' });
    }

    // Tính lại Star Rate
    const starRate = await contestService.recalculateStarRate(targetId);

    res.json({ success: true, starRate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.createComment = async (req, res) => {
  try {
    const { target_id, target_type, content } = req.body;
    const comment = await Comment.create({
      user_id: req.user.id,
      target_id,
      target_type,
      content
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getWinners = async (req, res) => {
  try {
    const { year, contestId } = req.query;
    const whereCondition = {};
    if (contestId) whereCondition.contest_id = contestId;

    const winners = await ContestWinner.findAll({
      where: whereCondition,
      include: [
        { model: User, as: 'winner', attributes: ['username'] },
        { model: Contest, as: 'contest', attributes: ['title', 'end_date'] }
      ]
    });

    res.json({ success: true, data: winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = new ContestController();