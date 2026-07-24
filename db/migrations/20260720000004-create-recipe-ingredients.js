'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipe_ingredients', {
      recipe_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        primaryKey: true,
      },
      ingredient_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        primaryKey: true,
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      note: {
        type: Sequelize.STRING(255),
        allowNull: true,
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

    await queryInterface.addConstraint('recipe_ingredients', {
      fields: ['recipe_id'],
      type: 'foreign key',
      name: 'fk_recipe_ingredients_recipe_id',
      references: {
        table: 'recipes',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('recipe_ingredients', {
      fields: ['ingredient_id'],
      type: 'foreign key',
      name: 'fk_recipe_ingredients_ingredient_id',
      references: {
        table: 'ingredients',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addIndex('recipe_ingredients', ['ingredient_id'], {
      name: 'idx_recipe_ingredients_ingredient_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipe_ingredients');
  }
};