'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('areas', 'id_servicio', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 4,
      references: {
        model: 'servicios',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    await queryInterface.changeColumn('asistencias', 'fecha', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    await queryInterface.addColumn('jornadas', 'hora_inicio', {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: '08:00:00',
    });
    await queryInterface.addColumn('jornadas', 'hora_fin', {
      type: Sequelize.TIME,
      allowNull: false,
      defaultValue: '05:00:00',
    });
    await queryInterface.addColumn('jornadas', 'dias_laborales', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
      defaultValue: [1, 2, 3, 4, 5],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('areas', 'id_servicio');
    await queryInterface.changeColumn('asistencias', 'fecha', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn('jornadas', 'hora_inicio');
    await queryInterface.removeColumn('jornadas', 'hora_fin');
    await queryInterface.removeColumn('jornadas', 'dias_laborales');
  }
};
