'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'user_sessions',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        session_token_id: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        refresh_token_hash: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        device_name: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        device_type: {
          type: Sequelize.STRING(50),
          allowNull: true
        },
        browser: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        operating_system: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        ip_address: {
          type: Sequelize.STRING(45),
          allowNull: true
        },
        country: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        city: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        user_agent: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        last_activity_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        revoked_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true
        }
      },
      {
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );

    /**
     * ==========================================
     * Unique Constraints
     * (MySQL automatically creates an index for this)
     * ==========================================
     */
    await queryInterface.addConstraint('user_sessions', {
      fields: ['session_token_id'],
      type: 'unique',
      name: 'uk_user_sessions_session_token_id'
    });

    /**
     * ==========================================
     * Indexes
     * ==========================================
     */
    await queryInterface.addIndex('user_sessions', ['expires_at'], {
      name: 'idx_user_sessions_expires_at'
    });

    await queryInterface.addIndex('user_sessions', ['deleted_at'], {
      name: 'idx_user_sessions_deleted_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_sessions');
  }
};