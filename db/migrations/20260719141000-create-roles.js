'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'roles',
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
        is_system_role: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE, allowNull: true }
      },
      { engine: 'InnoDB', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );

    await queryInterface.addConstraint('roles', { fields: ['name'], type: 'unique', name: 'uk_roles_name' });
    await queryInterface.addConstraint('roles', { fields: ['code'], type: 'unique', name: 'uk_roles_code' });
    await queryInterface.addIndex('roles', ['deleted_at'], { name: 'idx_roles_deleted_at' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};