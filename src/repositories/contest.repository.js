'use strict';
const { Op } = require('sequelize');
const { Contest, ContestSubmission, ContestWinner, User, Recipe, Comment, Like } = require('../models');

class ContestRepository {
  async findAll(filters = {}) {
    const { page = 1, limit = 6, type, status, scale, search, is_featured } = filters;
    const whereCondition = { is_banned: false };

    if (type) whereCondition.type = type;
    if (status) whereCondition.status = status;
    if (scale) whereCondition.scale = scale;
    if (is_featured !== undefined) whereCondition.is_featured = is_featured === 'true';
    if (search) {
      whereCondition.title = { [Op.like]: `%${search}%` };
    }

    const parsedLimit = parseInt(limit, 10);
    const offset = (parseInt(page, 10) - 1) * parsedLimit;

    return Contest.findAndCountAll({
      where: whereCondition,
      limit: parsedLimit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'email', 'role'] }
      ],
      distinct: true
    });
  }

  // SỬA TẠI ĐÂY: Hỗ trợ tìm bằng ID hoặc Slug
  async findById(idOrSlug) {
    return Contest.findOne({
      where: {
        [Op.or]: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'email', 'role'] },
        { 
          model: ContestSubmission, 
          as: 'submissions',
          include: [{ model: User, as: 'participant', attributes: ['id', 'username'] }]
        },
        { 
          model: ContestWinner, 
          as: 'winners',
          include: [{ model: User, as: 'winner', attributes: ['id', 'username'] }]
        }
      ]
    });
  }

  async create(data) {
    return Contest.create(data);
  }

  async createSubmission(data) {
    return ContestSubmission.create(data);
  }

  async findSubmissionById(id) {
    return ContestSubmission.findOne({
      where: { id },
      include: [
        { model: User, as: 'participant', attributes: ['id', 'username'] },
        { model: Contest, as: 'contest' }
      ]
    });
  }

  async getLikeCount(targetId, targetType) {
    return Like.count({ where: { target_id: targetId, target_type: targetType } });
  }

  async toggleLike(userId, targetId, targetType) {
    const existing = await Like.findOne({ where: { user_id: userId, target_id: targetId, target_type: targetType } });
    if (existing) {
      await existing.destroy();
      return { liked: false };
    }
    await Like.create({ user_id: userId, target_id: targetId, target_type: targetType });
    return { liked: true };
  }

  async addComment(data) {
    return Comment.create(data);
  }

  async getComments(targetId, targetType) {
    return Comment.findAll({
      where: { target_id: targetId, target_type: targetType, is_banned: false },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'role'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async findWinners(filters = {}) {
    const { page = 1, limit = 10, search } = filters;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    return ContestWinner.findAndCountAll({
      limit: parseInt(limit, 10),
      offset,
      order: [['created_at', 'DESC']],
      include: [
        { model: Contest, as: 'contest' },
        { model: User, as: 'winner', attributes: ['id', 'username', 'email'] },
        { model: ContestSubmission, as: 'winning_submission' }
      ]
    });
  }

  async toggleBanContest(id, banReason = null) {
    const contest = await Contest.findByPk(id);
    if (!contest) return null;
    contest.is_banned = !contest.is_banned;
    contest.ban_reason = contest.is_banned ? banReason : null;
    await contest.save();
    return contest;
  }
}

module.exports = new ContestRepository();