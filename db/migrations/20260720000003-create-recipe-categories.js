'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipe_categories', {
      recipe_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        primaryKey: true,
      },
      category_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    await queryInterface.addConstraint('recipe_categories', {
      fields: ['recipe_id'],
      type: 'foreign key',
      name: 'fk_recipe_categories_recipe_id',
      references: {
        table: 'recipes',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('recipe_categories', {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'fk_recipe_categories_category_id',
      references: {
        table: 'categories',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addIndex('recipe_categories', ['category_id'], {
      name: 'idx_recipe_categories_category_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipe_categories');
  }
};