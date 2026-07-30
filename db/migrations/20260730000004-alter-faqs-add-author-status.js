'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('faqs', 'answer', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('faqs', 'author_id', {
      type: Sequelize.CHAR(36),
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('faqs', 'status', {
      type: Sequelize.ENUM('pending', 'answered', 'hidden'),
      allowNull: false,
      defaultValue: 'answered'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('faqs', 'status');
    await queryInterface.removeColumn('faqs', 'author_id');
    await queryInterface.changeColumn('faqs', 'answer', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  }
};
