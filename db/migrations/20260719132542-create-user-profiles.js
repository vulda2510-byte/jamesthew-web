'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'user_profiles',
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
        first_name: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        last_name: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        display_name: {
          type: Sequelize.STRING(150),
          allowNull: true
        },
        avatar_url: {
          type: Sequelize.STRING(500),
          allowNull: true
        },
        cover_image_url: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        biography: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        date_of_birth: {
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        gender: {
          type: Sequelize.STRING(50),
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
        website: {
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
     * (Enforces the 1:1 relationship with users)
     * ==========================================
     */
    await queryInterface.addConstraint('user_profiles', {
      fields: ['user_id'],
      type: 'unique',
      name: 'uk_user_profiles_user_id'
    });

    /**
     * ==========================================
     * Indexes
     * ==========================================
     */
    await queryInterface.addIndex('user_profiles', ['deleted_at'], {
      name: 'idx_user_profiles_deleted_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_profiles');
  }
};