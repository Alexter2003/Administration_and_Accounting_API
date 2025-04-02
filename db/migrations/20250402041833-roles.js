'use strict';

const { ROL_TABLE, RolSchema } = require('../../src/models/rol.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(ROL_TABLE, RolSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(ROL_TABLE);
  },
};
