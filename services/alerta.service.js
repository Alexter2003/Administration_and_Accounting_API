const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');

class AlertaService {
  constructor() {}

  async create(data) {
    try {
      await models.Alerta.create(data);
      return 'Alerta agregada con exito';
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
        order: [['id', 'ASC']],
      });
      if (alertas.length < 1) {
        throw boom.notFound('No hay alertas activas');
      }
      return {
        message: 'Alertas activas encontradas correctamente',
        alertas: alertas,
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async findOne(id) {
    try {
      const alerta = await models.Alerta.findByPk(id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          estado: true,
        },

      });

      if (!alerta) {
        throw boom.notFound('Alerta no encontrada');
      }

      if (!alerta.estado) {
        throw boom.notFound('Alerta desactivada');
      }
      return alerta;
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async delete(id) {
    try {
      const alerta = await models.Alerta.findByPk(id);
      if (!alerta) {
        throw boom.notFound('Alerta no encontrada');
      }
      await alerta.update({ estado: false });
      return 'Alerta desactivada con exito';
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

}

module.exports = AlertaService;
