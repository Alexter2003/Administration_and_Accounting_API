const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');
const axios =  require('axios');

class OrdenService {
  constructor() {
    // Configuración de endpoints de reabastecimiento por servicio
    this.reabastecimientoEndpoints = {
      4: process.env.RESTOCK_SERVICE_1_URL || 'http://servicio1/api/restock',
      5: process.env.RESTOCK_SERVICE_2_URL || 'http://servicio2/api/restock',
      6: process.env.RESTOCK_SERVICE_3_URL || 'http://servicio3/api/restock',
      7: process.env.RESTOCK_SERVICE_4_URL || 'http://servicio4/api/restock',
    };
  }

  async find(){
    try {
      const ordenes = await models.Orden.findAll({
        order: [['id', 'ASC']],

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
      const orden = await models.Orden.findByPk(id, {
        attributes: {
          exclude: ['id_estado_orden', 'id_servicio', 'id_proveedor'],
        },
        include: [
          {
            model: models.EstadoOrden,
            as: 'estado_orden',
          },
          {
            model: models.Servicio,
            as: 'servicio',
            attributes: {
              exclude: ['descripcion', 'estado'],
            },
          },
          {
            model: models.Proveedor,
            as: 'proveedor',
            attributes: {
              exclude: ['descripcion', 'estado'],
            },
          },
          {
            model: models.OrdenDetalle,
            as: 'orden_detalles',
          },
        ],
      });
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

  async enviarSolicitudReabastecimiento(orden, detalles) {
    try {
      const endpoint = this.reabastecimientoEndpoints[orden.id_servicio];
      if (!endpoint) {
        throw boom.badRequest(`No hay endpoint de reabastecimiento configurado para el servicio ${orden.id_servicio}`);
      }

      // Datos para el reabastecimiento
      const datosReabastecimiento = {
        productos: detalles.map(detalle => ({
          producto_id: detalle.id_producto,
          cantidad: detalle.cantidad
        }))
      };

      // Enviar solicitud al servicio de reabastecimiento
      const response = await axios.post(endpoint, datosReabastecimiento);
      return response.data;

    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badImplementation('Error al procesar solicitud de reabastecimiento' + error);
    }
  }

  async update(id, changes) {
    const transaction = await models.Orden.sequelize.transaction();
    try {
      const orden = await models.Orden.findByPk(id, {
        include: [{
          model: models.OrdenDetalle,
          as: 'orden_detalles'
        }]
      });

      if (!orden) {
        throw boom.notFound('Orden no encontrada');
      }

      // Validar las transiciones de estado permitidas
      const estadoActual = orden.id_estado_orden;
      const nuevoEstado = changes.estado;

      // Validar que el nuevo estado sea válido (1: Confirmada, 2: En Proceso, 3: Entregada, 4: Cancelada)
      if (![1, 2, 3, 4].includes(nuevoEstado)) {
        throw boom.badRequest('Estado de orden no válido');
      }

      // Validar transiciones permitidas
      const transicionesPermitidas = {
        1: [2, 4],     // De Confirmada puede pasar a En Proceso o Cancelada
        2: [3, 4],     // De En Proceso puede pasar a Entregada o Cancelada
        3: [],         // De Entregada no puede cambiar
        4: [],         // De Cancelada no puede cambiar
      };

      if (!transicionesPermitidas[estadoActual].includes(nuevoEstado)) {
        throw boom.badRequest('Transición de estado no permitida');
      }

      await orden.update({
        id_estado_orden: nuevoEstado
      }, { transaction });

      // Si la orden pasa a estado "Entregada" (3), actualizar todos los detalles a Completo
      if (nuevoEstado === 3) {
        await Promise.all(orden.orden_detalles.map(async (detalle) => {
          await models.OrdenDetalle.update(
            { id_estado_detalle: 1 },
            {
              where: { id: detalle.id },
              transaction
            }
          );
        }));

        await transaction.commit();
        return {
          message: 'Estado de orden actualizado correctamente y detalles actualizados'
        };
      }

      await transaction.commit();

      // Respuesta normal para otros cambios de estado
      return {
        message: 'Estado de orden actualizado correctamente'
      };

    } catch (error) {
      await transaction.rollback();

      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async updateDetalleEstado(idDetalle, changes) {
    const transaction = await models.OrdenDetalle.sequelize.transaction();
    try {
      // Buscar el detalle de la orden
      const detalle = await models.OrdenDetalle.findByPk(idDetalle, {
        include: [{
          model: models.Orden,
          as: 'orden',
          attributes: ['id_estado_orden']
        }]
      });

      if (!detalle) {
        throw boom.notFound('Detalle de orden no encontrado');
      }

      // Verificar que la orden principal esté en estado 3 (Entregada)
      if (detalle.orden.id_estado_orden !== 3) {
        throw boom.badRequest('Solo se pueden modificar detalles de órdenes entregadas');
      }

      // Validar que el nuevo estado sea válido (1: Completo, 2: Incompleto, 3: No recibido)
      const nuevoEstado = changes.estado;
      if (![1, 2, 3].includes(nuevoEstado)) {
        throw boom.badRequest('Estado de detalle no válido. Estados permitidos: 1 (Completo), 2 (Incompleto), 3 (No recibido)');
      }

      // Si el estado es 2 (Incompleto), actualizar también la cantidad
      const updateData = {
        id_estado_detalle: nuevoEstado
      };

      if (nuevoEstado === 2) {
        if (!changes.cantidad) {
          throw boom.badRequest('Para marcar como incompleto, debe especificar la cantidad recibida');
        }
        updateData.cantidad = changes.cantidad;
      }

      // Actualizar el estado del detalle
      await detalle.update(updateData, { transaction });

      await transaction.commit();

      return {
        message: 'Estado del detalle actualizado correctamente'
      };
    } catch (error) {
      await transaction.rollback();

      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async reabastecer(id) {
    try {
      // Buscar la orden con sus detalles
      const orden = await models.Orden.findByPk(id, {
        include: [{
          model: models.OrdenDetalle,
          as: 'orden_detalles'
        }]
      });

      if (!orden) {
        throw boom.notFound('Orden no encontrada');
      }

      // Verificar que la orden esté en estado 3 (Entregada)
      if (orden.id_estado_orden !== 3) {
        throw boom.badRequest('Solo se pueden reabastecer órdenes en estado Entregada');
      }

      // Filtrar solo los detalles que no están en estado 3 (No recibido)
      const detallesParaReabastecer = orden.orden_detalles.filter(
        detalle => detalle.id_estado_detalle !== 3
      );

      if (detallesParaReabastecer.length === 0) {
        throw boom.badRequest('No hay productos para reabastecer en esta orden');
      }

      // Enviar solicitud de reabastecimiento solo con los productos recibidos
      const respuestaReabastecimiento = await this.enviarSolicitudReabastecimiento(orden, detallesParaReabastecer);

      return {
        message: 'Solicitud de reabastecimiento procesada',
        reabastecimiento: respuestaReabastecimiento
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }
}

module.exports = OrdenService;
