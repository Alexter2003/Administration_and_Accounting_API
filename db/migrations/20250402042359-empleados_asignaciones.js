'use strict';

const {
  EMPLEADO_ASIGNACION_TABLE,
  EmpleadoAsignacionSchema,
} = require('../../src/models/empleado_asignacion.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(
      EMPLEADO_ASIGNACION_TABLE,
      EmpleadoAsignacionSchema
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(EMPLEADO_ASIGNACION_TABLE);
  },
};
