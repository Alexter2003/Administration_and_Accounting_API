'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'servicios',
      [
        {
          nombre: 'broker',
          descripcion:
            'Servicio intermediario para gestionar transacciones entre sistemas',
          estado: true,
        },
        {
          nombre: 'admin',
          descripcion: 'Servicio de administración de la gasolinera',
          estado: true,
        },
        {
          nombre: 'pagos',
          descripcion: 'Servicio de pagos efectuados en la gasolinera',
          estado: true,
        },
        {
          nombre: 'gas',
          descripcion: 'Servicio de gas encargado de despachar gasolina',
          estado: true,
        },
        {
          nombre: 'tienda',
          descripcion: 'Servicio de tienda de conveniencia para la gasolinera',
          estado: true,
        },
        {
          nombre: 'repuestos',
          descripcion: 'Servicio de tienda de repuestos en gasolinera',
          estado: true,
        },
        {
          nombre: 'pintura',
          descripcion: 'Servicio de taller de pintura en la gasolinera',
          estado: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'servicios',
      {
        nombre: [
          'broker',
          'admin',
          'pagos',
          'gas',
          'tienda',
          'repuestos',
          'pintura',
        ],
      },
      {}
    );
  },
};
