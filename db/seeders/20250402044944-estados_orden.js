'use strict';

const { ESTADO_ORDEN_TABLE } = require('../../src/models/estado_orden.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const estados = [
      { nombre: 'Confirmada', descripcion: 'Orden creada y aceptada' },
      { nombre: 'En Proceso', descripcion: 'Orden en camino a ser entregada' },
      { nombre: 'Entregada', descripcion: 'Orden entregada al cliente' },
      { nombre: 'Cancelada', descripcion: 'Orden cancelada por el cliente' }
    ];

    for (const estado of estados) {
      await queryInterface.sequelize.query(
        `INSERT INTO "${ESTADO_ORDEN_TABLE}" (nombre, descripcion)
         SELECT :nombre, :descripcion
         WHERE NOT EXISTS (
           SELECT 1 FROM "${ESTADO_ORDEN_TABLE}" WHERE nombre = :nombre
         );`,
        { replacements: estado }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(ESTADO_ORDEN_TABLE, {
      nombre: ['Confirmada', 'En Proceso', 'Entregada', 'Cancelada'],
    });
  }
};
