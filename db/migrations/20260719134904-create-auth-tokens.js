'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'auth_tokens',
      {
        id: {
          type: Sequelize.CHAR(100),
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        session_id: {
          type: Sequelize.CHAR(100),
          allowNull: false,
          references: {
            model: 'user_sessions',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        token_type: { type: Sequelize.STRING(100), allowNull: false },
        token_hash: { type: Sequelize.STRING(255), allowNull: false },
        issued_at: { type: Sequelize.DATE, allowNull: false },
        expires_at: { type: Sequelize.DATE, allowNull: false },
        revoked_at: { type: Sequelize.DATE, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE, allowNull: true }
      },
      { engine: 'InnoDB', charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' }
    );

    await queryInterface.addConstraint('auth_tokens', {
      fields: ['token_hash'],
      type: 'unique',
      name: 'uk_auth_tokens_token_hash'
    });

    await queryInterface.addIndex('auth_tokens', ['token_type'], { name: 'idx_auth_tokens_token_type' });
    await queryInterface.addIndex('auth_tokens', ['expires_at'], { name: 'idx_auth_tokens_expires_at' });
    await queryInterface.addIndex('auth_tokens', ['deleted_at'], { name: 'idx_auth_tokens_deleted_at' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('auth_tokens');
  }
};