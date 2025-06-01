const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');

class RolesService {
  constructor () {}

  async create (data) {
    try {
      await models.Rol.create(data);
      return {
        message: 'Rol creado correctamente',
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async find () {
    try {
      const roles = await models.Rol.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          estado: true,
        },
        order: [['id', 'ASC']],
      });
      if (roles.length < 1) {
        throw boom.notFound('No hay roles activos');
      }
      return {
        message: 'Roles activos encontrados correctamente',
        roles: roles,
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
      const rol = await models.Rol.findByPk(id, {
        where: {
          estado: true
        }
      });

      if (!rol) {
        throw boom.notFound('Rol no encontrado');
      }
      if (!rol.estado) {
        throw boom.conflict('Rol desactivado');
      }
      return {
        message: 'Rol encontrado correctamente',
        rol: rol
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
      const rol = await models.Rol.findByPk(id, {
        where: {
          estado: true
        }
      });

      if (!rol) {
        throw boom.notFound('Rol no encontrado');
      }
      if (!rol.estado) {
        throw boom.conflict('Rol desactivado');
      }

      await rol.update(data);
      return {
        message: 'Rol actualizado correctamente',
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
      const rol = await models.Rol.findByPk(id, {
        where: {
          estado: true
        }
      });

      if (!rol) {
        throw boom.notFound('Rol no encontrado');
      }
      if (!rol.estado) {
        throw boom.conflict('Rol desactivado');
      }
      await rol.update({ estado: false });
      return {
        message: 'Rol eliminado correctamente',
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.badRequest(error);
    }
  }
}

module.exports = RolesService;
