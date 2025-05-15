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
      message: 'Estados encontrados correctamente',
      data: estados,
    };
  }
}

module.exports = EstadosOrdenService;
