const boom = require('@hapi/boom');
const axios = require('axios');
const { models } = require('../config/sequelize');
const { Op } = require('sequelize');

class MovimientosService {
  async create(data) {
    try {
      const mov = await models.Movimiento.create(data);
      return 'Movimiento creado correctamente';
    } catch (err) {
      throw boom.badRequest(err);
    }
  }

async findAll() {
  // Rango del año actual (puedes ajustarlo si es necesario)
  const hoy = new Date();
  const año = hoy.getFullYear();
  const primerDia = `${año}-01-01`;
  const ultimoDia = `${año}-12-31`;

  const id_servicio = 1; // puedes ajustar esto dinámicamente si deseas

  // Sincronizar órdenes y ventas antes de obtener movimientos
  try {
    await this.obtenerOrdenes({ desde: primerDia, hasta: ultimoDia, id_servicio });
  } catch (e) {
    console.warn('No se sincronizaron órdenes:', e.output?.payload?.message || e.message);
  }

  try {
    await this.obtenerVentas({ desde: primerDia, hasta: ultimoDia, id_servicio });
  } catch (e) {
    console.warn('No se sincronizaron ventas:', e.output?.payload?.message || e.message);
  }

  // Obtener todos los movimientos después de sincronizar
  const movimientos = await models.Movimiento.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    order: [['fecha_movimiento', 'DESC']],
  });

  if (movimientos.length === 0) {
    throw boom.notFound('No hay movimientos registrados');
  }

  return {
    message: 'Movimientos obtenidos correctamente',
    data: movimientos,
  };
}


  async findOne(id) {
    const mov = await models.Movimiento.findByPk(id);
    if (!mov) throw boom.notFound('Movimiento no encontrado');
    return { message: 'Movimiento encontrado', data: mov };
  }

async findDiarios({ fecha, id_servicio }) {
  const where = { fecha_movimiento: fecha, estado: true };
  if (id_servicio) {
    where.id_servicio = id_servicio;
  }

  const movs = await models.Movimiento.findAll({ where });
  if (!movs.length) throw boom.notFound('No hay movimientos diarios para esa fecha');
  return { message: 'Movimientos diarios encontrados', data: movs };
}



async findMensuales({ mes, año, id_servicio }) {
  const primerDia = new Date(año, mes - 1, 1);
  const ultimoDia = new Date(año, mes, 0);

  const where = {
    fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
    estado: true
  };

  if (id_servicio) {
    where.id_servicio = id_servicio;
  }

  const movs = await models.Movimiento.findAll({
    where,
    order: [['fecha_movimiento', 'ASC']]
  });

  if (!movs.length) throw boom.notFound('No hay movimientos mensuales en ese rango');
  return { message: 'Movimientos mensuales encontrados', data: movs };
}



async findTrimestrales({ trimestre, año, id_servicio }) {
  const inicioMes = (trimestre - 1) * 3;
  const finMes = inicioMes + 2;
  const primerDia = new Date(año, inicioMes, 1);
  const ultimoDia = new Date(año, finMes + 1, 0);

  const where = {
    fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
    estado: true
  };
  if (id_servicio) {
    where.id_servicio = id_servicio;
  }

  const movs = await models.Movimiento.findAll({ where });
  if (!movs.length) throw boom.notFound('No hay movimientos trimestrales en ese rango');
  return { message: 'Movimientos trimestrales encontrados', data: movs };
}



async findSemestrales({ semestre, año, id_servicio }) {
  const inicioMes = (semestre - 1) * 6;
  const finMes = inicioMes + 5;
  const primerDia = new Date(año, inicioMes, 1);
  const ultimoDia = new Date(año, finMes + 1, 0);

  const where = {
    fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
    estado: true
  };
  if (id_servicio) {
    where.id_servicio = id_servicio;
  }

  const movs = await models.Movimiento.findAll({ where });
  if (!movs.length) throw boom.notFound('No hay movimientos semestrales en ese rango');
  return { message: 'Movimientos semestrales encontrados', data: movs };
}


async findAnuales({ año, id_servicio }) {
  const primerDia = new Date(año, 0, 1);
  const ultimoDia = new Date(año, 11, 31);

  const where = {
    fecha_movimiento: { [Op.gte]: primerDia, [Op.lte]: ultimoDia },
    estado: true
  };
  if (id_servicio) {
    where.id_servicio = id_servicio;
  }

  const movs = await models.Movimiento.findAll({ where });
  if (!movs.length) throw boom.notFound('No hay movimientos anuales en ese rango');
  return { message: 'Movimientos anuales encontrados', data: movs };
}


async obtenerSalarios() {
  // 1. Obtener asignaciones activas con empleados activos y rol asociado
  const asignaciones = await models.EmpleadoAsignacion.findAll({
    where: { estado: true },
    include: [
      {
        model: models.Empleado,
        as: 'empleado',
        where: { estado: true },
      },
      {
        model: models.Rol,
        as: 'rol'
      }
    ]
  });

  if (!asignaciones.length) {
    throw boom.notFound('No hay empleados activos con rol asignado');
  }

  const fechaActual = new Date().toISOString().split('T')[0];

  const movimientos = asignaciones.map((asig) => ({
    id_tipo_movimiento: 1, // salario
    id_servicio: 2, // ajustable si hace falta
    concepto: `Pago de salario para rol ${asig.rol.descripcion}`,
    cantidad: asig.rol.salario,
    fecha_movimiento: fechaActual,
    estado: true,
  }));

  const result = await models.Movimiento.bulkCreate(movimientos);

  return {
    message: 'Salarios pagados e insertados como movimientos',
    data: result,
  };
}



async obtenerOrdenes({ desde, hasta }) {
  // 1) Todos los movimentos de tipo orden en el rango, de cualquier servicio
  const existentes = await models.Movimiento.findAll({
    where: {
      id_tipo_movimiento: 2,
      fecha_movimiento: { [Op.between]: [desde, hasta] },
    },
  });

  // 2) Crea el set de claves únicas (incluyendo el servicio)
  const yaInsertadas = new Set(
    existentes.map(m => {
      const concepto = m.concepto;
      const cantidad = Number(m.cantidad).toFixed(2);
      const fecha    = new Date(m.fecha_movimiento)
                          .toISOString().split('T')[0];
      const servicio = m.id_servicio;
      return `${concepto}_${cantidad}_${fecha}_${servicio}`;
    })
  );

  // 3) Llama al microservicio de órdenes (sin filtrar por servicio)
  let ordenes;
  try {
    const resp = await axios.get('http://localhost:3000/api/administracion/GET/ordenes', {
      params: { desde, hasta } // <–– ya no pasa id_servicio
    });
    ordenes = resp.data.data;
    if (!Array.isArray(ordenes)) {
      throw boom.badGateway('Respuesta de órdenes no es un array');
    }
  } catch (err) {
    throw boom.badGateway('No se pudo obtener datos del microservicio de órdenes');
  }

  // 4) Filtra y conserva sólo las NO insertadas aún
  const nuevas = ordenes.filter(o => {
    const concepto = `Pago de orden ${o.id}`;
    const cantidad = Number(o.costo_total).toFixed(2);
    const fecha    = new Date(o.fecha_orden)
                        .toISOString().split('T')[0];
    const servicio = o.id_servicio;
    const clave    = `${concepto}_${cantidad}_${fecha}_${servicio}`;
    return !yaInsertadas.has(clave);
  });

  // 5) Inserta las nuevas usando el id_servicio real de cada orden
  const insertados = await Promise.all(
    nuevas.map(o =>
      models.Movimiento.create({
        id_tipo_movimiento: 2,
        id_servicio:        o.id_servicio,
        concepto:           `Pago de orden ${o.id}`,
        cantidad:           o.costo_total,
        fecha_movimiento:   o.fecha_orden,
        estado:             true,
      })
    )
  );

  return {
    message: 'Órdenes insertadas como movimientos',
    data: insertados
  };
}



}

module.exports = MovimientosService;
