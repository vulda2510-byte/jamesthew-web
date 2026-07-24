'use strict';
const faqRepository = require('../repositories/faq.repository');
const { incrementDailyLimit } = require('../middlewares/contestAuth.middleware');

class FAQService {
  async getAllFAQs(filters) {
    return faqRepository.findAll(filters);
  }

  async askQuestion(data, userId, dailyLimitMeta) {
    const faq = await faqRepository.create({
      ...data,
      author_id: userId
    });

    if (dailyLimitMeta) {
      await incrementDailyLimit(userId, 'faq_ask', dailyLimitMeta.todayDate, dailyLimitMeta.record);
    }

    return faq;
  }

  async answerQuestion(id, answerText) {
    return faqRepository.answerQuestion(id, answerText);
  }
}

module.exports = new FAQService();