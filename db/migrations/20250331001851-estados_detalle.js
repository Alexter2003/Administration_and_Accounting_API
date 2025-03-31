'use strict';

const {
  ESTADO_DETALLE_TABLE,
  EstadoDetalleSchema,
} = require('../../src/models/estado_detalle.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(ESTADO_DETALLE_TABLE, EstadoDetalleSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(ESTADO_DETALLE_TABLE);
  },
};
