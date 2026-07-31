'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_profiles', 'phone', {
      type: Sequelize.STRING(30),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_profiles', 'phone');
  }
};
