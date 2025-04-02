'use strict';

const { ESTADO_DETALLE_TABLE } = require('../../src/models/estado_detalle.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert(ESTADO_DETALLE_TABLE, [
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
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(ESTADO_DETALLE_TABLE, {
      nombre: ['Completo', 'Incompleto', 'No recibido'],
    });
  },
};
