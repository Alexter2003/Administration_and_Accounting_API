'use strict';

const { AreasSchema, AREAS_TABLE } = require('../../src/models/areas.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(AREAS_TABLE, AreasSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(AREAS_TABLE);
  },
};
