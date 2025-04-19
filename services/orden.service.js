const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');

class OrdenService {
  constructor() {}

  async find(){
    try {
      const ordenes = await models.Orden.findAll({
        order: [['idmodels', 'ASC']],
      });
      if (ordenes.length < 1) {
        throw boom.notFound('No hay ordenes');
      }
      return {
        message: 'Ordenes activas encontradas correctamente',
        data: ordenes,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async findOne(id){
    try {
      const orden = await models.Orden.findByPk(id);
      if (!orden) {
        throw boom.notFound('Orden no encontrada');
      }
      return {
        message: 'Orden encontrada correctamente',
        data: orden,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async create(data){
    // Iniciar una transacción
    const transaction = await models.Orden.sequelize.transaction();
    try {
      const { detalles } = data;
      let sumaTotal = 0;

      // Crear la orden
      const newOrden = await models.Orden.create({
        id_servicio: data.id_servicio,
        id_proveedor: data.id_proveedor,
        fecha_orden: data.fecha_orden,
        costo_total: 0,
        id_estado_orden: 1,
      }, { transaction });

      // Crear los detalles de la orden
      await Promise.all(detalles.map(async (detalle) => {
        await models.OrdenDetalle.create({
          id_orden: newOrden.id,
          id_producto: detalle.id_producto,
          id_estado_detalle: 3,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario
        }, { transaction });
        sumaTotal += detalle.precio_unitario * detalle.cantidad;
      }));

      await models.Orden.update({
        costo_total: sumaTotal
      }, {
        where: { id: newOrden.id },
        transaction
      });

      // Si todo sale bien hacer commit de la transacción
      await transaction.commit();

      return {
        message: 'Orden creada correctamente',
        data: newOrden,
      };
    } catch (error) {
      // Para caso de error se hace un rollback de la transacción
      await transaction.rollback();

      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }
}

module.exports = OrdenService;
