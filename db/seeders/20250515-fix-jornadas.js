'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Verifica si hay registros en jornadas
    const jornadas = await queryInterface.sequelize.query(
      'SELECT id, hora_inicio, hora_fin, dias_laborales FROM jornadas;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (jornadas.length === 0) {
      // Si no hay registros, inserta dos por defecto
      await queryInterface.bulkInsert('jornadas', [
        {
          nombre: 'Jornada semanal',
          descripcion: 'Lunes a viernes',
          hora_inicio: '08:00:00',
          hora_fin: '05:00:00',
          dias_laborales: [1, 2, 3, 4, 5],
          estado: true
        },
        {
          nombre: 'Jornada fin de semana',
          descripcion: 'Sábado y domingo',
          hora_inicio: '08:00:00',
          hora_fin: '05:00:00',
          dias_laborales: [6, 7],
          estado: true
        }
      ]);
    } else {
      // Si hay registros, actualiza los valores nulos
      await queryInterface.bulkUpdate(
        'jornadas',
        { hora_inicio: '08:00:00' },
        { hora_inicio: null }
      );
      await queryInterface.bulkUpdate(
        'jornadas',
        { hora_fin: '05:00:00' },
        { hora_fin: null }
      );
      await queryInterface.bulkUpdate(
        'jornadas',
        { dias_laborales: [1, 2, 3, 4, 5] },
        { dias_laborales: null }
      );
      // Si quieres asegurar que el segundo registro tenga [6,7]:
      await queryInterface.bulkUpdate(
        'jornadas',
        { dias_laborales: [6, 7] },
        { id: 2 }
      );
    }
  },

  async down(queryInterface, Sequelize) {
  }
};
