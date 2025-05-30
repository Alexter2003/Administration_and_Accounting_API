const { models } = require('./../config/sequelize');
const boom = require('@hapi/boom');

class ServiciosService {
  constructor() {}

  async find() {
    const servicios = await models.Servicio.findAll({
      order: [['id', 'ASC']],
    });

    if (servicios.length === 0) {
      throw boom.notFound('No hay servicios disponibles');
    }

    return {
      message: 'Servicios encontrados correctamente',
      servicios: servicios,
    };
  }

  async findOne(id) {
    const servicio = await models.Servicio.findByPk(id);

    if (!servicio) {
      throw boom.notFound('Servicio no encontrado');
    }

    return {
      message: 'Servicio encontrado correctamente',
      servicio: servicio,
    };
  }
}

module.exports = ServiciosService;
