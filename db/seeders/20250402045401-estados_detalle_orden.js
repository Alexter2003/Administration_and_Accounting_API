'use strict';

const { ESTADO_DETALLE_TABLE } = require('../../src/models/estado_detalle.model');

module.exports = {
  async up(queryInterface) {
    const estadosDetalle = [
      {
        nombre: 'Completo',
        descripcion: 'El producto se encuentra completo'
      },
      {
        nombre: 'Incompleto',
        descripcion: 'El producto se encuentra incompleto'
      },
      {
        nombre: 'No recibido',
        descripcion: 'El producto no se recibió en la orden'
      }
    ];

    for (const estado of estadosDetalle) {
      await queryInterface.sequelize.query(
        `INSERT INTO "${ESTADO_DETALLE_TABLE}" (nombre, descripcion)
         SELECT :nombre, :descripcion
         WHERE NOT EXISTS (
           SELECT 1 FROM "${ESTADO_DETALLE_TABLE}" WHERE nombre = :nombre
         );`,
        { replacements: estado }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(ESTADO_DETALLE_TABLE, {
      nombre: ['Completo', 'Incompleto', 'No recibido']
    });
  }
};
