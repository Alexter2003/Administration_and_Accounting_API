const boom = require('@hapi/boom');
const axios = require('axios');
const { models } = require('../config/sequelize');
const { Op } = require('sequelize');

class MovimientosService {
  async create(data) {
    try {
      const mov = await models.Movimiento.create(data);
      return { message: 'Movimiento creado correctamente', data: mov };
    } catch (err) {
      throw boom.badRequest(err);
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
  
    if (movimientos.length === 0) {
      throw boom.notFound('No hay movimientos encontrados con los filtros proporcionados');
    }
  
    return {
      message: 'Movimientos filtrados correctamente',
      data: movimientos
    };
  }
  

  async findOne(id) {
    const mov = await models.Movimiento.findByPk(id);
    if (!mov) throw boom.notFound('Movimiento no encontrado');
    return { message: 'Movimiento encontrado', data: mov };
  }

  async findDiarios({ fecha, id_servicio }) {
    if (!id_servicio) throw boom.badRequest('id_servicio es requerido');
    const movs = await models.Movimiento.findAll({
      where: { id_servicio, fecha_movimiento: fecha, estado: true },
      order:[['fecha_movimiento','ASC']]
    });
    if (!movs.length) throw boom.notFound('No hay movimientos diarios para esa fecha');
    return { message: 'Movimientos diarios encontrados', data: movs };
  }

  async findMensuales({ mes, año, id_servicio }) {
    if (!id_servicio) throw boom.badRequest('id_servicio es requerido');
    const primerDia = new Date(año, mes-1, 1);
    const ultimoDia = new Date(año, mes, 0);
    const movs = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
        estado: true
      },
      order:[['fecha_movimiento','ASC']]
    });
    if (!movs.length) throw boom.notFound('No hay movimientos mensuales en ese rango');
    return { message: 'Movimientos mensuales encontrados', data: movs };
  }

  async findTrimestrales({ trimestre, año, id_servicio }) {
    if (!id_servicio) throw boom.badRequest('id_servicio es requerido');
    const inicioMes = (trimestre-1)*3;
    const finMes    = inicioMes+2;
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes+1, 0);
    const movs = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
        estado: true
      },
      order:[['fecha_movimiento','ASC']]
    });
    if (!movs.length) throw boom.notFound('No hay movimientos trimestrales en ese rango');
    return { message: 'Movimientos trimestrales encontrados', data: movs };
  }

  async findSemestrales({ semestre, año, id_servicio }) {
    if (!id_servicio) throw boom.badRequest('id_servicio es requerido');
    const inicioMes = (semestre-1)*6;
    const finMes    = inicioMes+5;
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes+1, 0);
    const movs = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
        estado: true
      },
      order:[['fecha_movimiento','ASC']]
    });
    if (!movs.length) throw boom.notFound('No hay movimientos semestrales en ese rango');
    return { message: 'Movimientos semestrales encontrados', data: movs };
  }

  async findAnuales({ año, id_servicio }) {
    if (!id_servicio) throw boom.badRequest('id_servicio es requerido');
    const primerDia = new Date(año, 0, 1);
    const ultimoDia = new Date(año, 11, 31);
    const movs = await models.Movimiento.findAll({
      where: {
        id_servicio,
        fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
        estado: true
      },
      order:[['fecha_movimiento','ASC']]
    });
    if (!movs.length) throw boom.notFound('No hay movimientos anuales en ese rango');
    return { message: 'Movimientos anuales encontrados', data: movs };
  }

  async obtenerSalarios() {
    const rolesActivos = await models.Rol.findAll({
      where: { estado: true },
      attributes: ['salario', 'descripcion'],
    });
  
    if (!rolesActivos.length) {
      throw boom.notFound('No hay roles activos con salario');
    }
  
    const fechaActual = new Date().toISOString().split('T')[0];
    const movimientos = rolesActivos.map(rol => ({
      id_tipo_movimiento: 1, // ID para tipo "salario"
      id_servicio: 1,
      concepto: `Pago de salario para rol ${rol.descripcion}`,
      cantidad: rol.salario,
      fecha_movimiento: fechaActual,
      estado: true,
    }));
  
    const result = await models.Movimiento.bulkCreate(movimientos);
    return {
      message: 'Salarios pagados e insertados como movimientos',
      data: result,
    };
  }
  
  async obtenerOrdenes(query) {
    const { desde, hasta, id_servicio } = query;
  
    const existentes = await models.Movimiento.findAll({
      where: {
        id_tipo_movimiento: 2,
        id_servicio,
        fecha_movimiento: {
          [Op.between]: [desde, hasta],
        },
      },
    });
  
    let ordenes;
    try {
      const response = await axios.get('http://localhost:3000/api/administracion/GET/ordenes', {
        params: { desde, hasta, id_servicio }
      });
      ordenes = response.data.data;
  
      if (!Array.isArray(ordenes)) {
        throw boom.badGateway('La respuesta del microservicio de órdenes no es un array');
      }
  
    } catch (error) {
      throw boom.badGateway('No se pudo obtener datos del microservicio de órdenes');
    }
  
    // 3. Filtrar órdenes no repetidas
    const yaInsertadas = new Set(
      existentes.map((m) => `${m.concepto}_${m.cantidad}_${m.fecha_movimiento}`)
    );
  
    const nuevas = ordenes.filter((orden) => {
      const concepto = `Pago de orden ${orden.id}`;
      const clave = `${concepto}_${orden.costo_total}_${orden.fecha_orden}`;
      return !yaInsertadas.has(clave);
    });
  
    // 4. Insertar las nuevas como movimientos
    const movimientosInsertados = await Promise.all(
      nuevas.map((orden) =>
        models.Movimiento.create({
          id_tipo_movimiento: 2,
          id_servicio,
          concepto: `Pago de orden ${orden.id}`,
          cantidad: orden.costo_total,
          fecha_movimiento: orden.fecha_orden,
          estado: true,
        })
      )
    );
  
    return {
      message: 'Órdenes insertadas como movimientos',
      data: movimientosInsertados,
    };
  }
  
  

  async obtenerVentas({ desde, hasta, id_servicio }) {
    try {
      // Obtener ventas desde microservicio
      const resp = await axios.get('http://localhost:3000/api/pagos/transacciones', {
        params: { desde, hasta, id_servicio }
      });
  
      const ventas = resp.data?.data || [];
  
      if (!ventas.length) {
        throw boom.notFound('No se encontraron ventas en el rango de fechas indicado');
      }
  
      const existentes = await models.Movimiento.findAll({
        where: {
          id_tipo_movimiento: 4,
          id_servicio,
          fecha_movimiento: {
            [Op.between]: [desde, hasta],
          },
        },
      });
  
      const yaInsertadas = new Set(
        existentes.map((m) => `${m.concepto}_${m.cantidad}_${m.fecha_movimiento}`)
      );
  
      const nuevas = ventas.filter((venta) => {
        const concepto = `Venta ${venta.NoTransaccion}`;
        const clave = `${concepto}_${venta.Total}_${venta.Fecha}`;
        return !yaInsertadas.has(clave);
      });
  
      const movimientos = nuevas.map((venta) => ({
        concepto: `Venta ${venta.NoTransaccion}`,
        cantidad: venta.Total,
        fecha_movimiento: venta.Fecha,
        id_tipo_movimiento: 4,
        id_servicio,
        estado: true,
      }));
  
      const result = await models.Movimiento.bulkCreate(movimientos);
  
      return {
        message: 'Ventas insertadas como movimientos',
        data: result
      };
    } catch (error) {
      throw boom.badGateway('No se pudo obtener datos del microservicio de ventas');
    }
  }
  
}

module.exports = MovimientosService;
