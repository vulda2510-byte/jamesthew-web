'use strict';
const { FAQ, User } = require('../models');

class FAQRepository {
  async findAll(filters = {}) {
    const { category, search } = filters;
    const whereCondition = { status: ['answered', 'pending'] };

    if (category) whereCondition.category = category;
    if (search) {
      whereCondition.question = { [require('sequelize').Op.like]: `%${search}%` };
    }

    return FAQ.findAll({
      where: whereCondition,
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      order: [['created_at', 'DESC']]
    });
  }

  async create(data) {
    return FAQ.create(data);
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