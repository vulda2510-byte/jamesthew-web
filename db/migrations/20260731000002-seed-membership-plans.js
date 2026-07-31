'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const plans = [
      {
        name: 'Free',
        price: 0.00,
        billing_cycle: 'monthly',
        features: JSON.stringify([
          'Browse all public recipes',
          'Save recipes to your profile',
          'Follow other chefs'
        ]),
        is_popular: false,
        created_at: now,
        updated_at: now
      },
      {
        name: 'Premium',
        price: 9.99,
        billing_cycle: 'monthly',
        features: JSON.stringify([
          'Everything in Free',
          'Access premium recipes',
          'Download printable recipe cards',
          'Priority support'
        ]),
        is_popular: true,
        created_at: now,
        updated_at: now
      },
      {
        name: 'VIP',
        price: 24.99,
        billing_cycle: 'monthly',
        features: JSON.stringify([
          'Everything in Premium',
          'Access VIP masterclasses',
          'Early access to new contests',
          '1-on-1 chef Q&A sessions'
        ]),
        is_popular: false,
        created_at: now,
        updated_at: now
      }
    ];

    // Idempotent: this DB may already have plans seeded manually via db/query.sql,
    // so only insert the ones that aren't already there instead of failing on the
    // uq_membership_plans_name unique constraint.
    const [existingRows] = await queryInterface.sequelize.query(
      'SELECT name FROM membership_plans WHERE name IN (:names)',
      { replacements: { names: plans.map(p => p.name) } }
    );
    const existingNames = new Set(existingRows.map(r => r.name));
    const plansToInsert = plans.filter(p => !existingNames.has(p.name));

    if (plansToInsert.length > 0) {
      await queryInterface.bulkInsert('membership_plans', plansToInsert);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('membership_plans', {
      name: ['Free', 'Premium', 'VIP']
    });
  }
};
