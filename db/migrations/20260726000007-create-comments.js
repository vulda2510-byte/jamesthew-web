'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.CHAR(100),
        primaryKey: true,
        allowNull: false
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
      target_id: {
        type: Sequelize.CHAR(100),
        allowNull: false
      },
      target_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'Loại đối tượng (VD: contest, submission...)'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_banned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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

    await queryInterface.addIndex('comments', ['target_id', 'target_type'], { name: 'idx_comments_target' });
    await queryInterface.addIndex('comments', ['user_id'], { name: 'idx_comments_user_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments');
  }
};