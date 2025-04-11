'use strict';

const { EMPLEADO_TABLE } = require('../../src/models/empleado.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(EMPLEADO_TABLE, 'usuario', {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    });

    await queryInterface.addColumn(EMPLEADO_TABLE, 'password', {
      type: Sequelize.STRING(255), // Using 255 to accommodate hashed passwords
      allowNull: false
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(EMPLEADO_TABLE, 'usuario');
    await queryInterface.removeColumn(EMPLEADO_TABLE, 'password');
  }
};
