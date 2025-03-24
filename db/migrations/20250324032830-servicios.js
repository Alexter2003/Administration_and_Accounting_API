'use strict';

const {
  SERVICIOS_TABLE,
  ServiciosSchema,
} = require('../../src/models/servicios.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(SERVICIOS_TABLE, ServiciosSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(SERVICIOS_TABLE);
  },
};
