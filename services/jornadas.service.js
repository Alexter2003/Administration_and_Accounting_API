const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');

class JornadasService {
  constructor () {}

  async find () {
    try {
      const jornadas = await models.Jornada.findAll({
        where: {
          estado: true,
        },
        order: [['id', 'ASC']],
      });
      if (jornadas.length < 1) {
        throw boom.notFound('No hay jornadas activas');
      }
      return {
        message: 'Jornadas activas encontradas correctamente',
        data: jornadas,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async findOne (id) {
    try {
      const jornada = await models.Jornada.findByPk(id, {
        where: {
          estado: true
        }
      });

      if (!jornada) {
        throw boom.notFound('Jornada no encontrada');
      }
      if (!jornada.estado) {
        throw boom.conflict('Jornada desactivada');
      }
      return {
        message: 'Jornada encontrada correctamente',
        data: jornada
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

}

module.exports = JornadasService;
