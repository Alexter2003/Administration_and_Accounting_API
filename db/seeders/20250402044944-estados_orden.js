'use strict';

const { ESTADO_ORDEN_TABLE } = require('../../src/models/estado_orden.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const estados = [
      {
        nombre: 'Confirmada',
        descripcion: 'Orden creada y aceptada',
      },
      {
        nombre: 'En Proceso',
        descripcion: 'Orden en camino a ser entregada',
      },
      {
        nombre: 'Entregada',
        descripcion: 'Orden entregada al cliente',
      },
      {
        nombre: 'Cancelada',
        descripcion: 'Orden cancelada por el cliente',
      },
    ];

    // Check for existing records
    const existingRecords = await queryInterface.sequelize.query(
      `SELECT nombre FROM "${ESTADO_ORDEN_TABLE}";`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingNames = existingRecords.map(record => record.nombre);

    // Filter out existing records
    const newRecords = estados.filter(estado => !existingNames.includes(estado.nombre));

    if (newRecords.length > 0) {
      await queryInterface.bulkInsert(ESTADO_ORDEN_TABLE, newRecords);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(ESTADO_ORDEN_TABLE, {
      nombre: ['Confirmada', 'En Proceso', 'Entregada', 'Cancelada'],
    });
  },
};
