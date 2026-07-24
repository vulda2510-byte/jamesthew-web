'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
        id: { type: Sequelize.CHAR(100), primaryKey: true, allowNull: false },
        email: { type: Sequelize.STRING(255), allowNull: false },
        username: { type: Sequelize.STRING(100), allowNull: false },
        password_hash: { type: Sequelize.STRING(255), allowNull: false },
        account_status: {
          type: Sequelize.ENUM('pending', 'active', 'suspended', 'banned'),
          allowNull: false,
          defaultValue: 'pending'
        },
        // THÊM MỚI: Cột role để đồng bộ với Middleware Auth và thanh toán Stripe
        role: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: 'free'
        },
        email_verified_at: { type: Sequelize.DATE, allowNull: true },
        last_login_at: { type: Sequelize.DATE, allowNull: true },
        stripe_customer_id: { type: Sequelize.STRING(255), allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE, allowNull: true }
      },
      { engine: 'InnoDB', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );

    await queryInterface.addConstraint('users', { fields: ['email'], type: 'unique', name: 'uk_users_email' });
    await queryInterface.addConstraint('users', { fields: ['username'], type: 'unique', name: 'uk_users_username' });
    await queryInterface.addConstraint('users', { fields: ['stripe_customer_id'], type: 'unique', name: 'uk_users_stripe_customer_id' });
    await queryInterface.addIndex('users', ['account_status'], { name: 'idx_users_account_status' });
    await queryInterface.addIndex('users', ['deleted_at'], { name: 'idx_users_deleted_at' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_account_status";');
    }
  }
};