'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recipes', {
      id: { type: Sequelize.CHAR(100), primaryKey: true, allowNull: false },
      user_id: { type: Sequelize.CHAR(100), allowNull: false },
      
      // THÊM MỚI: Liên kết với bảng categories
      category_id: { type: Sequelize.CHAR(100), allowNull: true },
      
      title: { type: Sequelize.STRING(255), allowNull: false },
      slug: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      prep_time_minutes: { type: Sequelize.INTEGER, allowNull: true },
      cook_time_minutes: { type: Sequelize.INTEGER, allowNull: true },
      servings: { type: Sequelize.INTEGER, allowNull: true },
      difficulty: { type: Sequelize.STRING(40), allowNull: true },
      status: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'draft' },
      thumbnail_url: { type: Sequelize.STRING(255), allowNull: true },
      
      // THÊM MỚI: Cờ hiển thị giao diện và bảo vệ nội dung
      is_featured: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_premium: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    await queryInterface.addConstraint('recipes', { fields: ['slug'], type: 'unique', name: 'uq_recipes_slug' });
    await queryInterface.addConstraint('recipes', {
      fields: ['user_id'], type: 'foreign key', name: 'fk_recipes_user_id',
      references: { table: 'users', field: 'id' }, onDelete: 'RESTRICT', onUpdate: 'CASCADE'
    });
    
    // Ràng buộc khóa ngoại với categories
    await queryInterface.addConstraint('recipes', {
      fields: ['category_id'], type: 'foreign key', name: 'fk_recipes_category_id',
      references: { table: 'categories', field: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE'
    });

    await queryInterface.addIndex('recipes', ['user_id'], { name: 'idx_recipes_user_id' });
    await queryInterface.addIndex('recipes', ['category_id'], { name: 'idx_recipes_category_id' });
    await queryInterface.addIndex('recipes', ['status'], { name: 'idx_recipes_status' });
    await queryInterface.addIndex('recipes', ['deleted_at'], { name: 'idx_recipes_deleted_at' });
    await queryInterface.addIndex('recipes', ['title', 'description'], { type: 'FULLTEXT', name: 'ft_idx_recipes_search' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recipes');
  }
};