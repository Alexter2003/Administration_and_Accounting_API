const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');
const { Op } = require('sequelize');

class MovimientosService {
  constructor() {}

  async create(data) {
    try {
      const nuevoMovimiento = await models.Movimiento.create(data);
      return {
        message: 'Movimiento creado correctamente',
        data: nuevoMovimiento,
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async find() {
    try {
      const movimientos = await models.Movimiento.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['id', 'ASC']],
      });

      if (movimientos.length === 0) {
        throw boom.notFound('No hay movimientos registrados');
      }

      return {
        message: 'Movimientos obtenidos correctamente',
        data: movimientos,
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async findOne(id) {
    try {
      const movimiento = await models.Movimiento.findByPk(id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });

      if (!movimiento) {
        throw boom.notFound('Movimiento no encontrado');
      }

      return {
        message: 'Movimiento encontrado correctamente',
        data: movimiento,
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async findWithFilters(query) {
    const where = {};

    if (query.tipo) {
      const tipoMovimiento = await models.TipoMovimiento.findOne({ where: { nombre: query.tipo } });
      if (tipoMovimiento) {
        where.id_tipo_movimiento = tipoMovimiento.id;
      }
    }

    if (query.desde || query.hasta) {
      where.fecha_movimiento = {};
      if (query.desde) where.fecha_movimiento[Op.gte] = query.desde;
      if (query.hasta) where.fecha_movimiento[Op.lte] = query.hasta;
    }

    if (query.id_servicio) {
      where.id_servicio = query.id_servicio;
    }

    const movimientos = await models.Movimiento.findAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['fecha_movimiento', 'DESC']]
    });

    return {
      message: 'Movimientos filtrados correctamente',
      data: movimientos
    };
  }

  async findDiarios({ fecha, id_servicio }) {
    const { Op } = require('sequelize');
  
    const movimientos = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: fecha,
        estado: true
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['fecha_movimiento', 'ASC']]
    });
  
    return {
      message: 'Movimientos diarios encontrados',
      data: movimientos
    };
  }
  
  async findMensuales({ fecha_mes, año, id_servicio }) {
    const primerDia = new Date(año, fecha_mes - 1, 1);
    const ultimoDia = new Date(año, fecha_mes, 0);

    const movimientos = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: {
          [Op.gte]: primerDia,
          [Op.lte]: ultimoDia
        },
        estado: true
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['fecha_movimiento', 'ASC']]
    });

    return {
      message: 'Movimientos mensuales encontrados',
      data: movimientos
    };
  }

  async findTrimestrales({ trimestre, año, id_servicio }) {
    const { Op } = require('sequelize');
  
    // Calcular rango de meses según trimestre
    const inicioMes = (trimestre - 1) * 3;
    const finMes = inicioMes + 2;
  
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes + 1, 0); // Día 0 del mes siguiente = último del mes actual
  
    const movimientos = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: {
          [Op.gte]: primerDia,
          [Op.lte]: ultimoDia
        },
        estado: true
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['fecha_movimiento', 'ASC']]
    });
  
    return {
      message: 'Movimientos trimestrales encontrados',
      data: movimientos
    };
  }
  
  async findSemestrales({ semestre, año, id_servicio }) {
    const { Op } = require('sequelize');
  
    const inicioMes = (semestre - 1) * 6;
    const finMes = inicioMes + 5;
  
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes + 1, 0);
  
    const movimientos = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: {
          [Op.gte]: primerDia,
          [Op.lte]: ultimoDia
        },
        estado: true
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['fecha_movimiento', 'ASC']]
    });
  
    return {
      message: 'Movimientos semestrales encontrados',
      data: movimientos
    };
  }
  

  async findAnuales({ año, id_servicio }) {
    const { Op } = require('sequelize');
  
    const primerDia = new Date(año, 0, 1);
    const ultimoDia = new Date(año, 11, 31);
  
    const movimientos = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: {
          [Op.gte]: primerDia,
          [Op.lte]: ultimoDia
        },
        estado: true
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['fecha_movimiento', 'ASC']]
    });
  
    return {
      message: 'Movimientos anuales encontrados',
      data: movimientos
    };
  }
  
  
  

  async delete(id) {
    try {
      const movimiento = await models.Movimiento.findByPk(id);
      if (!movimiento) {
        throw boom.notFound('Movimiento no encontrado');
      }

      await movimiento.update({ estado: false });
      return {
        message: 'Movimiento eliminado correctamente'
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }
}

module.exports = MovimientosService;
