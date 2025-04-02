'use strict';

const { ESTADO_ORDEN_TABLE } = require('../../src/models/estado_orden.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert(ESTADO_ORDEN_TABLE, [
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
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(ESTADO_ORDEN_TABLE, {
      nombre: ['Confirmada', 'En Proceso', 'Entregada', 'Cancelada'],
    });
  },
};
