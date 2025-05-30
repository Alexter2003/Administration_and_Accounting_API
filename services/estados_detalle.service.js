const { models } = require('./../config/sequelize');
const boom = require('@hapi/boom');
class EstadosDetalleService {
  constructor() {}

  async find() {
    const estados = await models.EstadoDetalle.findAll({
      order: [['id', 'ASC']],
    });

    if (estados.length === 0) {
      throw boom.notFound('No hay estados disponibles');
    }

    return {
      estados_ordenes_detalles: estados,
    };
  }
}

module.exports = EstadosDetalleService;