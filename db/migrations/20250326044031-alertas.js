'use strict';

const { ALERTA_TABLE, AlertaSchema } = require('../../src/models/alerta.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(ALERTA_TABLE, AlertaSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(ALERTA_TABLE);
  },
};
