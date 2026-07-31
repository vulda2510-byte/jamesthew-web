'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
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

    // Unique Constraint: Mỗi user chỉ thích 1 target 1 lần
    await queryInterface.addConstraint('likes', {
      fields: ['user_id', 'target_id', 'target_type'],
      type: 'unique',
      name: 'unique_user_target'
    });

    await queryInterface.addIndex('likes', ['target_id', 'target_type'], { name: 'idx_likes_target' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('likes');
  }
};