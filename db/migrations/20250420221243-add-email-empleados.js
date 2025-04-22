'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('empleados', 'email', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: 'example@example.com'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('empleados', 'email');
  },
};
