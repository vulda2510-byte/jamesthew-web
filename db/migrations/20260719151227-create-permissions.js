'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'permissions',
      {
        id: {
          type: Sequelize.CHAR(100),
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        name: { type: Sequelize.STRING(100), allowNull: false },
        code: { type: Sequelize.STRING(100), allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },
        module: { type: Sequelize.STRING(50), allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE, allowNull: true }
      },
      { engine: 'InnoDB', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );

    await queryInterface.addConstraint('permissions', { fields: ['name'], type: 'unique', name: 'uk_permissions_name' });
    await queryInterface.addConstraint('permissions', { fields: ['code'], type: 'unique', name: 'uk_permissions_code' });
    await queryInterface.addIndex('permissions', ['module'], { name: 'idx_permissions_module' });
    await queryInterface.addIndex('permissions', ['deleted_at'], { name: 'idx_permissions_deleted_at' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions');
  }
};