'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contest_submissions', {
      id: {
        type: Sequelize.CHAR(100),
        primaryKey: true,
        allowNull: false
      },
      contest_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        references: {
          model: 'contests',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    await queryInterface.addIndex('contest_submissions', ['contest_id'], { name: 'idx_submissions_contest_id' });
    await queryInterface.addIndex('contest_submissions', ['user_id'], { name: 'idx_submissions_user_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contest_submissions');
  }
};