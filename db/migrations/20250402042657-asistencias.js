'use strict';

const {
  ASISTENCIA_TABLE,
  AsistenciaSchema,
} = require('../../src/models/asistencia.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(ASISTENCIA_TABLE, AsistenciaSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(ASISTENCIA_TABLE);
  },
};
