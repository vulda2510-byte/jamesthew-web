'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipe_steps', {
      id: {
        type: Sequelize.CHAR(100),
        primaryKey: true,
        allowNull: false,
      },
      recipe_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
      },
      step_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      instruction: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image_url: {
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    await queryInterface.addConstraint('recipe_steps', {
      fields: ['recipe_id'],
      type: 'foreign key',
      name: 'fk_recipe_steps_recipe_id',
      references: {
        table: 'recipes',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('recipe_steps', {
      fields: ['recipe_id', 'step_number'],
      type: 'unique',
      name: 'uq_recipe_steps_recipe_id_step_number'
    });

    await queryInterface.addIndex('recipe_steps', ['recipe_id'], {
      name: 'idx_recipe_steps_recipe_id'
    });

    await queryInterface.addIndex('recipe_steps', ['step_number'], {
      name: 'idx_recipe_steps_step_number'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipe_steps');
  }
};