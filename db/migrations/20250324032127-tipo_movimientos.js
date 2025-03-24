'use strict';

const {
  TIPO_MOVIMIENTO_TABLE,
  TipoMovimientoSchema,
} = require('../../src/models/tipo_movimiento.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(
      TIPO_MOVIMIENTO_TABLE,
      TipoMovimientoSchema
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(TIPO_MOVIMIENTO_TABLE);
  },
};
