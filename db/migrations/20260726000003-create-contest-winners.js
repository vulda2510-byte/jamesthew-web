'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contest_winners', {
      id: {
        type: Sequelize.CHAR(100),
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      contest_id: {
        type: Sequelize.CHAR(100), // Khớp với contests.id
        allowNull: false,
        references: {
          model: 'contests',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.CHAR(100), // Khớp với users.id
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      submission_id: {
        type: Sequelize.CHAR(100), // Khớp với contest_submissions.id
        allowNull: true,
        references: {
          model: 'contest_submissions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1 = Quán Quân, 2 = Á Quân, 3 = Hạng 3'
      },
      prize: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      // ĐÃ BỔ SUNG: Khớp Charset & Collation với bảng contests và users
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contest_winners');
  }
};