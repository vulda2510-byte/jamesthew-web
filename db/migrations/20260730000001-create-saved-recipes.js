'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('saved_recipes', {
      id: {
        type: Sequelize.CHAR(100),
        defaultValue: Sequelize.UUIDV4,
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
      recipe_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id'
        },
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

    // Mỗi user chỉ lưu 1 công thức 1 lần
    await queryInterface.addConstraint('saved_recipes', {
      fields: ['user_id', 'recipe_id'],
      type: 'unique',
      name: 'unique_user_saved_recipe'
    });

    await queryInterface.addIndex('saved_recipes', ['user_id'], { name: 'idx_saved_recipes_user' });
    await queryInterface.addIndex('saved_recipes', ['recipe_id'], { name: 'idx_saved_recipes_recipe' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('saved_recipes');
  }
};