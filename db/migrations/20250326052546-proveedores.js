'use strict';

const {
  PROVEEDORES_TABLE,
  ProveedoresSchema,
} = require('../../src/models/proveedores.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(PROVEEDORES_TABLE, ProveedoresSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(PROVEEDORES_TABLE);
  },
};
