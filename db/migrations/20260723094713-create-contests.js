'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contests', {
      id: {
        type: Sequelize.CHAR(100),
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'online'
      },
      scale: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'small'
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'upcoming'
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      rules: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      prize_details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      is_banned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      ban_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      author_id: {
        type: Sequelize.CHAR(100),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    await queryInterface.addIndex('contests', ['slug'], { name: 'uk_contests_slug', unique: true });
    await queryInterface.addIndex('contests', ['status'], { name: 'idx_contests_status' });
    await queryInterface.addIndex('contests', ['author_id'], { name: 'idx_contests_author_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contests');
  }
};