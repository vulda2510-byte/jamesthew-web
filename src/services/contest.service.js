'use strict';
const contestRepository = require('../repositories/contest.repository');
const { incrementDailyLimit } = require('../middlewares/contestAuth.middleware');

class ContestService {
  async getAllContests(filters) {
    return contestRepository.findAll(filters);
  }

  async getContestById(id) {
    const contest = await contestRepository.findById(id);
    if (!contest) throw new Error('Contest not found');

    const likesCount = await contestRepository.getLikeCount(id, 'contest');
    const comments = await contestRepository.getComments(id, 'contest');

    // Thuật toán tính Star Rate (Thang điểm 5)
    // Star Rate = 1.0 (cơ bản) + (Likes * 0.2) + (Comments * 0.3), tối đa 5.0
    const calculatedStarRate = Math.min(5.0, Number((1.0 + (likesCount * 0.2) + (comments.length * 0.3)).toFixed(1)));

    return {
      ...contest.toJSON(),
      like_rate: likesCount,
      star_rate: calculatedStarRate,
      comments
    };
  }

  async createContest(data, user, dailyLimitMeta) {
    // Logic kiểm tra scale theo Role
    if (user.role === 'premium' && data.scale === 'large') {
      throw new Error('Tài khoản Premium chỉ được phép tạo cuộc thi quy mô Small (Mini Contest).');
    }

    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    const contest = await contestRepository.create({
      ...data,
      slug,
      author_id: user.id
    });

    // Cập nhật số đếm hạn mức hành động trong ngày
    if (dailyLimitMeta) {
      await incrementDailyLimit(user.id, 'contest_create', dailyLimitMeta.todayDate, dailyLimitMeta.record);
    }

    return contest;
  }

  async submitEntry(contestId, data, userId) {
    return contestRepository.createSubmission({
      ...data,
      contest_id: contestId,
      user_id: userId
    });
  }

  async toggleLike(userId, targetId, targetType) {
    return contestRepository.toggleLike(userId, targetId, targetType);
  }

  async addComment(data, userId, dailyLimitMeta) {
    const comment = await contestRepository.addComment({
      ...data,
      user_id: userId
    });

    if (dailyLimitMeta) {
      await incrementDailyLimit(userId, 'comment', dailyLimitMeta.todayDate, dailyLimitMeta.record);
    }

    return comment;
  }

  async getWinners(filters) {
    return contestRepository.findWinners(filters);
  }

  async toggleBanContest(id, banReason) {
    return contestRepository.toggleBanContest(id, banReason);
  }
}

module.exports = new ContestService();