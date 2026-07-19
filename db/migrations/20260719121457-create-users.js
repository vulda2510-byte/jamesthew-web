'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        username: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        password_hash: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        account_status: {
          type: Sequelize.ENUM(
            'pending',
            'active',
            'suspended',
            'banned'
          ),
          allowNull: false,
          defaultValue: 'pending'
        },
        email_verified_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        last_login_at: {
          type: Sequelize.DATE,
          allowNull: true
        },
        stripe_customer_id: {
          type: Sequelize.STRING(255),
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
     * (MySQL automatically creates indexes for these)
     * ==========================================
     */
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'uk_users_email'
    });

    await queryInterface.addConstraint('users', {
      fields: ['username'],
      type: 'unique',
      name: 'uk_users_username'
    });

    await queryInterface.addConstraint('users', {
      fields: ['stripe_customer_id'],
      type: 'unique',
      name: 'uk_users_stripe_customer_id'
    });

    /**
     * ==========================================
     * Indexes
     * ==========================================
     */
    await queryInterface.addIndex('users', ['account_status'], {
      name: 'idx_users_account_status'
    });

    await queryInterface.addIndex('users', ['deleted_at'], {
      name: 'idx_users_deleted_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');

    // PostgreSQL requires manually dropping ENUM types.
    // MySQL ignores this section, but it is kept for multi-dialect compatibility.
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_users_account_status";'
      );
    }
  }
};