const { models } = require('./../config/sequelize');
const boom = require('@hapi/boom');

class EstadosOrdenService {
  constructor() {}

  async find() {
    const estados = await models.EstadoOrden.findAll({
      order: [['id', 'ASC']],
    });

    if (estados.length === 0) {
      throw boom.notFound('No hay estados disponibles');
    }

    return {
      estados_ordenes: estados,
    };
  }
}

module.exports = EstadosOrdenService;
