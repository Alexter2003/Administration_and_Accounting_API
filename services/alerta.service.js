const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');

class AlertaService {
  constructor() {}

  async create(data) {
    try {
      const newAlerta = await models.Alerta.create(data);
      return {
        message: 'Alerta creada correctamente',
        data: newAlerta,
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async find() {
    try {
      const alertas = await models.Alerta.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          estado: true,
        },
      });
      return {
        message: 'Alertas activas encontradas correctamente',
        data: alertas,
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async findOne(id) {
    try {
      const alerta = await models.Alerta.findByPk(id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_servicio'],
        },
        where: {
          estado: true,
        },
        include: [
          {
            model: models.Servicio,
            as: 'servicio',
            attributes: ['id', 'nombre'],
          },
        ],
      });

      if (!alerta) {
        throw boom.notFound('Alerta no encontrada');
      }
      return alerta;
    } catch (error) {
      throw boom.badRequest(error);
    }
  }
}

module.exports = AlertaService;
