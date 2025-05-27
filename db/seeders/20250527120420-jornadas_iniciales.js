'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const jornadas = [
      {
        nombre: 'Jornada completa',
        descripcion: 'Jornada comprendida de lunes a viernes entre 8:00AM - 5PM',
        estado: true,
        hora_inicio: '08:00:00',
        hora_fin: '17:00:00',
        dias_laborales: [1, 2, 3, 4, 5],
      },
      {
        nombre: 'Jornada fin de semana',
        descripcion: 'Jornada comprendida de sábado y domingo entre 8:00AM - 5PM',
        estado: true,
        hora_inicio: '08:00:00',
        hora_fin: '17:00:00',
        dias_laborales: [6, 7],
      },
    ];

    // Evita duplicados si ya existen
    const existing = await queryInterface.sequelize.query(
      'SELECT nombre FROM jornadas;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const existingNames = existing.map(j => j.nombre);

    const newRecords = jornadas.filter(j => !existingNames.includes(j.nombre));

    if (newRecords.length > 0) {
      await queryInterface.bulkInsert('jornadas', newRecords, {});
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'jornadas',
      {
        nombre: [
          'Jornada completa',
          'Jornada fin de semana',
        ],
      },
      {}
    );
  },
};
