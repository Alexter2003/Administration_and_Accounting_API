'use strict';

const {
  MOVIMIENTO_TABLE,
  MovimientoSchema,
} = require('../../src/models/movimiento.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(MOVIMIENTO_TABLE, MovimientoSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(MOVIMIENTO_TABLE);
  },
};
