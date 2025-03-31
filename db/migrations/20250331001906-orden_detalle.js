'use strict';

const {
  ORDEN_DETALLE_TABLE,
  OrdenDetalleSchema,
} = require('../../src/models/orden_detalle.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(ORDEN_DETALLE_TABLE, OrdenDetalleSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(ORDEN_DETALLE_TABLE);
  },
};
