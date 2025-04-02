'use strict';

const {
  EMPLEADO_TABLE,
  EmpleadoSchema,
} = require('../../src/models/empleado.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(EMPLEADO_TABLE, EmpleadoSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(EMPLEADO_TABLE);
  },
};
