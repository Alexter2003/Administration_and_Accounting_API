'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      'areas',
      { id_servicio: 4 },
      { id_servicio: null }
    );

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

    await queryInterface.bulkUpdate(
      'jornadas',
      { dias_laborales: [6, 7] },
      { id: 2 }
    );
  },

  async down(queryInterface, Sequelize) {

  }
};
