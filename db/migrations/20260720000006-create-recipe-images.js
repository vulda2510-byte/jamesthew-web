'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipe_images', {
      id: {
        type: Sequelize.CHAR(100),
        primaryKey: true,
        allowNull: false,
      },
      recipe_id: {
        type: Sequelize.CHAR(100),
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      alt_text: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    await queryInterface.addConstraint('recipe_images', {
      fields: ['recipe_id'],
      type: 'foreign key',
      name: 'fk_recipe_images_recipe_id',
      references: {
        table: 'recipes',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('recipe_images', {
      fields: ['recipe_id', 'display_order'],
      type: 'unique',
      name: 'uq_recipe_images_recipe_id_display_order'
    });

    await queryInterface.addIndex('recipe_images', ['recipe_id'], {
      name: 'idx_recipe_images_recipe_id'
    });

    await queryInterface.addIndex('recipe_images', ['display_order'], {
      name: 'idx_recipe_images_display_order'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipe_images');
  }
};