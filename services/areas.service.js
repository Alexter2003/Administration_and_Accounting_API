const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');

class AreasService {
  constructor () {}

  async create (data) {
    try {
      const newArea = await models.Areas.create(data);
      return {
        message: 'Area creada correctamente',
        data: newArea
      };
    } catch (error) {
      throw boom.badRequest(error.message);
    }
  }

  async find () {
    try {
      const areas = await models.Areas.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          estado: true
        },
        order: [['id', 'ASC']]
      });
      if (areas.length < 1) {
        throw boom.notFound('No hay areas activas');
      }
      return {
        message: 'Areas activas encontradas correctamente',
        data: areas
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badRequest(error);
    }
  }

  async findOne (id) {
    try {
      const area = await models.Areas.findByPk(id, {
        where: {
          estado: true
        }
      });

      if (!area) {
        throw boom.notFound('Area no encontrada');
      }
      if (!area.estado) {
        throw boom.conflict('Area desactivada');
      }
      return {
        message: 'Area encontrada correctamente',
        data: area
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badRequest(error);
    }
  }

  async update (id, data) {
    try {
      const area = await models.Areas.findByPk(id);
      if (!area) {
        throw boom.notFound('Area no encontrada');
      }
      const updatedArea = await area.update(data);
      return {
        message: 'Area actualizada correctamente',
        data: updatedArea
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badRequest(error);
    }
  }

  async delete (id) {
    try {
      const area = await models.Areas.findByPk(id);
      if (!area) {
        throw boom.notFound('Area no encontrada');
      }
      await area.update({ estado: false });
      return {
        message: 'Area eliminada correctamente'
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badRequest(error);
    }
  }
}

module.exports = AreasService;
