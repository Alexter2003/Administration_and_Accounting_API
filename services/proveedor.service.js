const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');

class ProveedorService {
  constructor() {}

  async create(data) {
    try {
      await models.Proveedor.create(data);
      return {
        message: 'Proveedor registrado correctamente',
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async find() {
    try {
      const proveedores = await models.Proveedor.findAll({
        where: {
          estado: true,
        },
        order: [['id', 'ASC']],
      });
      if (proveedores.length < 1) {
        throw boom.notFound('No hay proveedores activos');
      }
      return {
        message: 'Proveedores activos encontrados correctamente',
        proveedores: proveedores,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async findOne(id) {
    try {
      const proveedor = await models.Proveedor.findByPk(id, {
        where: {
          estado: true,
        },
      });
      if (!proveedor) {
        throw boom.notFound('Proveedor no encontrado');
      }
      if (!proveedor.estado) {
        throw boom.conflict('Proveedor desactivado');
      }
      return {
        message: 'Proveedor encontrado correctamente',
        proveedor: proveedor,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async update(id, changes) {
    try {

       await models.Proveedor.update(changes, {
        where: { id },
        returning: true
      });
      return {
        message: 'Proveedor actualizado correctamente',
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async delete(id) {
    try {
      const proveedor = await models.Proveedor.findByPk(id);
      if (!proveedor) {
        throw boom.notFound('Proveedor no encontrado');
      }
      if (!proveedor.estado) {
        throw boom.conflict('El proveedor ya esta desactivado');
      }
      await proveedor.update({ estado: false });
      return {
        message: 'Proveedor eliminado correctamente',
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }
}

module.exports = ProveedorService;
