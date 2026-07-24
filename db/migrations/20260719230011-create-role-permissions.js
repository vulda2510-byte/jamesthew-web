'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'role_permissions',
      {
        id: {
          type: Sequelize.CHAR(100),
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        role_id: {
          type: Sequelize.CHAR(100),
          allowNull: false,
          references: { model: 'roles', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        permission_id: {
          type: Sequelize.CHAR(100),
          allowNull: false,
          references: { model: 'permissions', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        assigned_at: { type: Sequelize.DATE, allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE, allowNull: true }
      },
      { engine: 'InnoDB', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );

    await queryInterface.addConstraint('role_permissions', {
      fields: ['role_id', 'permission_id'],
      type: 'unique',
      name: 'uk_role_permissions_role_id_permission_id'
    });

    await queryInterface.addIndex('role_permissions', ['deleted_at'], { name: 'idx_role_permissions_deleted_at' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role_permissions');
  }
};