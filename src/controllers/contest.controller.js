'use strict';
const { Contest, ContestSubmission, ContestWinner, Comment, User, Like, Sequelize } = require('../models');
const { Op } = Sequelize;
const contestService = require('../services/contest.service');

class ContestController {
  // 1. Lấy danh sách tất cả cuộc thi
  async getAll(req, res) {
    try {
      const { type, scale, search } = req.query;
      const whereCondition = {};

      if (type) whereCondition.type = type;
      if (scale) whereCondition.scale = scale;
      if (search) {
        whereCondition.title = { [Op.like]: `%${search.trim()}%` };
      }

      const contests = await Contest.findAll({ where: whereCondition });
      return res.status(200).json({ success: true, data: contests });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 2. Hàm Lấy chi tiết Contest & Bình luận
  async getById(req, res) {
    try {
      const { id } = req.params;

      // 1. Tìm Contest (Hỗ trợ cả ID số, ID UUID lẫn Slug)
      let contest = await Contest.findOne({
        where: {
          [Sequelize.Op.or]: [
            { id: id },
            { slug: id }
          ]
        }
      });

      if (!contest) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy cuộc thi' });
      }

      // 2. Query Comment Độc Lập & Tự Ghép User
      let comments = [];
      try {
        const rawComments = await Comment.findAll({
          where: {
            target_id: { [Sequelize.Op.in]: [String(contest.id), contest.slug].filter(Boolean) },
            target_type: 'contest'
          },
          order: [['created_at', 'DESC']],
          raw: true
        });

        const userIds = [...new Set(rawComments.map(c => c.user_id))].filter(Boolean);

        const users = await User.findAll({
          where: { id: userIds },
          attributes: ['id', 'username', 'role'],
          raw: true
        });

        const userMap = {};
        users.forEach(u => { userMap[u.id] = u; });

        comments = rawComments.map(c => ({
          ...c,
          author: userMap[c.user_id] || { username: 'Anonymous' }
        }));
      } catch (commentErr) {
        console.warn('Lỗi query comments:', commentErr.message);
      }

      // 3. Kiểm tra lượt Like & Trạng thái Like của User
      let totalLikes = 0;
      let isLiked = false;
      const currentUserId = req.user?.id || res.locals?.user?.id;

      try {
        if (typeof Like !== 'undefined') {
          totalLikes = await Like.count({
            where: { target_id: String(contest.id), target_type: 'contest' }
          });

          if (currentUserId) {
            const userLike = await Like.findOne({
              where: { user_id: currentUserId, target_id: String(contest.id), target_type: 'contest' }
            });
            isLiked = !!userLike;
          }
        }
      } catch (lErr) {
        console.warn('Lỗi đếm lượt like:', lErr.message);
      }

      // 4. Tổng hợp dữ liệu trả về
      const contestData = contest.toJSON ? contest.toJSON() : contest;
      contestData.comments = comments;
      contestData.totalLikes = totalLikes;
      contestData.isLiked = isLiked;

      return res.status(200).json({ success: true, data: contestData });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 3. Lấy danh sách Vinh danh / Winners
  async getWinners(req, res) {
    try {
      const { year, contestName, contestId } = req.query;
      const whereContest = {};

      if (contestName) {
        whereContest.title = { [Op.like]: `%${contestName.trim()}%` };
      }

      const winners = await ContestWinner.findAll({
        where: contestId ? { contest_id: contestId } : {},
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email']
          },
          {
            model: Contest,
            as: 'contest',
            attributes: ['id', 'title', 'start_date', 'end_date'],
            where: Object.keys(whereContest).length > 0 ? whereContest : undefined
          },
          {
            model: ContestSubmission,
            as: 'submission',
            attributes: ['id', 'title', 'image_url']
          }
        ],
        order: [['rank', 'ASC']]
      });

      let filteredWinners = winners;
      if (year) {
        filteredWinners = winners.filter(w => {
          const date = w.contest?.start_date || w.created_at;
          return new Date(date).getFullYear().toString() === year.toString();
        });
      }

      return res.status(200).json({ success: true, data: filteredWinners });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 4. Tạo cuộc thi mới
  async create(req, res) {
    try {
      const userId = req.user?.id || res.locals?.user?.id;
      const userRole = req.user?.role || res.locals?.user?.role;

      if (req.body.scale === 'large' && !['vip', 'admin'].includes(userRole)) {
        return res.status(403).json({ success: false, message: 'Quy mô cuộc thi Lớn chỉ dành cho VIP hoặc Admin.' });
      }

      const slug = req.body.title ? req.body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : `contest-${Date.now()}`;
      
      const newContest = await Contest.create({
        ...req.body,
        slug,
        author_id: userId,
        status: 'upcoming'
      });

      return res.status(201).json({ success: true, data: newContest });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 5. Nộp bài / Đăng ký Offline
  async submitEntry(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || res.locals?.user?.id;

      let contest = await Contest.findOne({
        where: {
          [Sequelize.Op.or]: [
            { id: id },
            { slug: id }
          ]
        }
      });

      if (!contest) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy cuộc thi' });
      }

      const submission = await ContestSubmission.create({
        contest_id: contest.id,
        user_id: userId,
        title: req.body.title || 'Offline Event Registration',
        image_url: req.body.image_url || null,
        content: req.body.content || 'Offline Registration'
      });

      return res.status(201).json({ success: true, data: submission });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 6. Like / Unlike cuộc thi
  async toggleLike(req, res) {
    try {
      let { target_id, contest_id } = req.body;
      const contestIdInput = target_id || contest_id;
      const userId = req.user?.id || res.locals?.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để thực hiện' });
      }

      // Quy đổi Slug/ID
      const contest = await Contest.findOne({
        where: {
          [Sequelize.Op.or]: [
            { id: contestIdInput },
            { slug: contestIdInput }
          ]
        }
      });

      if (!contest) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy cuộc thi' });
      }

      const realContestId = String(contest.id);
      let isLiked = false;

      // Kiểm tra xem đã like chưa
      const existingLike = await Like.findOne({
        where: { user_id: userId, target_id: realContestId, target_type: 'contest' }
      });

      if (existingLike) {
        await existingLike.destroy();
        isLiked = false;
      } else {
        await Like.create({
          user_id: userId,
          target_id: realContestId,
          target_type: 'contest'
        });
        isLiked = true;
      }

      // Đếm lại tổng số Like
      const totalLikes = await Like.count({
        where: { target_id: realContestId, target_type: 'contest' }
      });

      return res.status(200).json({
        success: true,
        message: isLiked ? 'Đã thích cuộc thi' : 'Đã bỏ thích',
        data: { isLiked, totalLikes }
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 7. Khóa / Mở khóa cuộc thi
  async toggleBan(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const contest = await Contest.findByPk(id);
      if (!contest) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy cuộc thi' });
      }

      contest.is_banned = !contest.is_banned;
      contest.ban_reason = contest.is_banned ? reason : null;
      await contest.save();

      return res.status(200).json({ 
        success: true, 
        message: contest.is_banned ? 'Đã khóa cuộc thi' : 'Đã mở khóa cuộc thi', 
        data: contest 
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 8. Thêm bình luận
  async addComment(req, res) {
    try {
      let { target_id, target_type, content } = req.body;
      const userId = req.user?.id || res.locals?.user?.id;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
      }

      if (target_type === 'contest' || !target_type) {
        const contest = await Contest.findOne({
          where: {
            [Sequelize.Op.or]: [
              { id: target_id },
              { slug: target_id }
            ]
          }
        });
        if (contest) {
          target_id = contest.id;
        }
      }

      const comment = await Comment.create({
        user_id: userId,
        target_id: String(target_id),
        target_type: target_type || 'contest',
        content: content.trim()
      });

      return res.status(201).json({ success: true, data: comment });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
async renderContestListPage(req, res) {
        try {
            res.render('contests-list', {
                title: 'All Culinary Contests | JamesThew'
            });
        } catch (error) {
            console.error("Error rendering contest list page:", error);
            res.status(500).render('error', { message: "Internal Server Error" });
        }
    }
}

module.exports = new ContestController();