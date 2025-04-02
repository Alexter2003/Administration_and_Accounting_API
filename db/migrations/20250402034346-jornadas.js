'use strict';

const {
  JORNADA_TABLE,
  JornadaSchema,
} = require('../../src/models/jornada.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(JORNADA_TABLE, JornadaSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(JORNADA_TABLE);
  },
};
