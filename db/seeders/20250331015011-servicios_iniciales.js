'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const servicios = [
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
        descripcion: 'Servicio de mantenimiento de vehiculos y repuestos en gasolinera',
        estado: true,
      },
      {
        nombre: 'pintura',
        descripcion: 'Servicio de taller de pintura en la gasolinera',
        estado: true,
      },
      {
        nombre: 'frontend',
        descripcion: 'Servicio de interfaz de usuario para la gasolinera',
        estado: true,
      },
    ];

    // Check for existing records
    const existingRecords = await queryInterface.sequelize.query(
      'SELECT nombre FROM servicios;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingNames = existingRecords.map(record => record.nombre);

    // Filter out existing records
    const newRecords = servicios.filter(servicio => !existingNames.includes(servicio.nombre));

    if (newRecords.length > 0) {
      await queryInterface.bulkInsert('servicios', newRecords, {});
    }
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
