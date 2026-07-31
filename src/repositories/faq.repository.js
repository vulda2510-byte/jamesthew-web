'use strict';
const { FAQ, User } = require('../models');

class FAQRepository {
  async findAll(filters = {}) {
    const { category, search } = filters;
    const { Op } = require('sequelize');
    const whereCondition = {
      status: { [Op.in]: ['answered', 'pending'] },
      is_active: true
    };

    if (category) whereCondition.category = category;
    if (search) {
      whereCondition.question = { [Op.like]: `%${search}%` };
    }

    return FAQ.findAll({
      where: whereCondition,
      include: [{ model: User, as: 'author', attributes: ['id', 'username'], required: false }],
      order: [['created_at', 'DESC']]
    });
  }

  async create(data) {
    return FAQ.create({
      ...data,
      answer: data.answer || null,
      status: data.status || 'pending',
      is_active: true
    });
  }

  async answerQuestion(id, answerText) {
    const faq = await FAQ.findByPk(id);
    if (!faq) return null;
    faq.answer = answerText;
    faq.status = 'answered';
    await faq.save();
    return faq;
  }
}

module.exports = new FAQRepository();