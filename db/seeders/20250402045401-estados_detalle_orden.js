'use strict';

const { ESTADO_DETALLE_TABLE } = require('../../src/models/estado_detalle.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const estados = [
      {
        nombre: 'Completo',
        descripcion: 'El producto se encuentra completo',
      },
      {
        nombre: 'Incompleto',
        descripcion: 'El producto se encuentra incompleto',
      },
      {
        nombre: 'No recibido',
        descripcion: 'El producto no se recibio en la orden',
      }
    ];

    // Check for existing records
    const existingRecords = await queryInterface.sequelize.query(
      `SELECT nombre FROM "${ESTADO_DETALLE_TABLE}";`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingNames = existingRecords.map(record => record.nombre);

    // Filter out existing records
    const newRecords = estados.filter(estado => !existingNames.includes(estado.nombre));

    if (newRecords.length > 0) {
      await queryInterface.bulkInsert(ESTADO_DETALLE_TABLE, newRecords);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(ESTADO_DETALLE_TABLE, {
      nombre: ['Completo', 'Incompleto', 'No recibido'],
    });
  },
};
