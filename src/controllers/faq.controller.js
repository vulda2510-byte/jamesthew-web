'use strict';
const faqService = require('../services/faq.service');

class FAQController {
  async getAll(req, res) {
    try {
      const faqs = await faqService.getAllFAQs(req.query);
      return res.status(200).json({ success: true, data: faqs });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async ask(req, res) {
    try {
      const dailyMeta = { todayDate: req.todayDate, record: req.dailyLimitRecord };
      const faq = await faqService.askQuestion(req.body, res.locals.user.id, dailyMeta);
      return res.status(201).json({ success: true, data: faq });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async answer(req, res) {
    try {
      const faq = await faqService.answerQuestion(req.params.id, req.body.answer);
      return res.status(200).json({ success: true, data: faq });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FAQController();