'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar id_servicio a areas
    await queryInterface.addColumn('areas', 'id_servicio', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'servicios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    // 2. Cambiar tipo de fecha en asistencias a DATE
    await queryInterface.changeColumn('asistencias', 'fecha', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    // 3. Agregar columnas a jornadas
    await queryInterface.addColumn('jornadas', 'hora_inicio', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.addColumn('jornadas', 'hora_fin', {
      type: Sequelize.TIME,
      allowNull: false,
    });
    await queryInterface.addColumn('jornadas', 'dias_laborales', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('areas', 'id_servicio');
    // Si el tipo anterior de fecha era diferente, ajústalo aquí
    await queryInterface.changeColumn('asistencias', 'fecha', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn('jornadas', 'hora_inicio');
    await queryInterface.removeColumn('jornadas', 'hora_fin');
    await queryInterface.removeColumn('jornadas', 'dias_laborales');
  }
};
