'use strict';

const {
  ESTADO_ORDEN_TABLE,
  EstadoOrdenSchema,
} = require('../../src/models/estado_orden.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(ESTADO_ORDEN_TABLE, EstadoOrdenSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(ESTADO_ORDEN_TABLE);
  },
};
