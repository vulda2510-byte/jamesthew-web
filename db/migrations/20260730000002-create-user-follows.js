'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_follows', {
      id: {
        type: Sequelize.CHAR(100),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      follower_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      following_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addConstraint('user_follows', {
      fields: ['follower_id', 'following_id'],
      type: 'unique',
      name: 'unique_user_follow'
    });

    await queryInterface.addIndex('user_follows', ['follower_id'], { name: 'idx_follows_follower' });
    await queryInterface.addIndex('user_follows', ['following_id'], { name: 'idx_follows_following' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_follows');
  }
};