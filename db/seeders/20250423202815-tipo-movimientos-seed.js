'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('tipo_movimientos', [
      {
        id: 1,
        nombre: 'salario',
        descripcion: 'Pago de salarios a empleados',
        estado: true
      },
      {
        id: 2,
        nombre: 'orden',
        descripcion: 'Egreso por orden de compra o servicio',
        estado: true
      },
      {
        id: 3,
        nombre: 'reembolso',
        descripcion: 'Reembolso por devolución',
        estado: true
      },
      {
        id: 4,
        nombre: 'venta',
        descripcion: 'Ingreso por venta de productos',
        estado: true
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tipo_movimientos', {
      nombre: ['salario', 'orden', 'reembolso', 'venta']
    }, {});
  }
};
