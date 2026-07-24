'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('membership_plans', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      billing_cycle: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'monthly'
      },
      features: {
        // Dùng JSON để lưu danh sách các tính năng (để render ra các gạch đầu dòng)
        type: Sequelize.JSON,
        allowNull: true
      },
      is_popular: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    await queryInterface.addConstraint('membership_plans', {
      fields: ['name'],
      type: 'unique',
      name: 'uq_membership_plans_name'
    });

    await queryInterface.addIndex('membership_plans', ['deleted_at'], {
      name: 'idx_membership_plans_deleted_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('membership_plans');
  }
};