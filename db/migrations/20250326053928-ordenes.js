'use strict';

const {
  ORDENES_TABLE,
  OrdenesSchema,
} = require('../../src/models/ordenes.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(ORDENES_TABLE, OrdenesSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(ORDENES_TABLE);
  },
};
