'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Verifica si hay registros en areas
    const areas = await queryInterface.sequelize.query(
      'SELECT id, nombre, descripcion, id_servicio FROM areas;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (areas.length === 0) {
      // Si no hay registros, inserta uno por defecto (ajusta los campos según tu modelo)
      await queryInterface.bulkInsert('areas', [
        {
          nombre: 'Área ejemplo',
          descripcion: 'Descripción de área ejemplo',
          id_servicio: 4
        }
      ]);
    } else {
      // Si hay registros, actualiza los valores nulos en id_servicio
      await queryInterface.bulkUpdate(
        'areas',
        { id_servicio: 4 },
        { id_servicio: null }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Opcional: puedes borrar el registro de ejemplo si lo deseas
  }
};
