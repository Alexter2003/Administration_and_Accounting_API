const boom = require('@hapi/boom');
const axios = require('axios');
const { models, sequelize } = require('../config/sequelize');
const { Op, QueryTypes } = require('sequelize');

class MovimientosService {
  constructor() {
    this.sequelize = sequelize;
  }

  // Método simplificado que usa vista_movimientos_por_tipo
  async obtenerMovimientosAgrupados({ fechaInicio, fechaFin, id_servicio, incluirExternos = false }) {
    let whereConditions = [];
    let params = {};

    // Construir condiciones WHERE dinámicamente
    if (fechaInicio && fechaFin) {
      const inicio = this.soloFecha(fechaInicio);
      const fin = this.soloFecha(fechaFin);

      if (inicio.getTime() === fin.getTime()) {
        whereConditions.push("fecha_movimiento = :fecha");
        params.fecha = inicio.toISOString().split('T')[0];
      } else {
        whereConditions.push("fecha_movimiento BETWEEN :fechaInicio AND :fechaFin");
        params.fechaInicio = inicio.toISOString().split('T')[0];
        params.fechaFin = fin.toISOString().split('T')[0];
      }
    }

    if (id_servicio) {
      whereConditions.push("id_servicio = :id_servicio");
      params.id_servicio = id_servicio;
    }

        // Construir cláusula WHERE para el LEFT JOIN
    let joinConditions = "tm.id = vmc.id_tipo_movimiento";
    if (whereConditions.length > 0) {
      joinConditions += ` AND ${whereConditions.join(' AND ')}`;
    }

    // Consulta usando la vista para obtener movimientos agrupados por tipo
    const query = `
      SELECT
        tm.nombre as tipo_movimiento,
        COALESCE(SUM(vmc.cantidad), 0) as total_monetario,
        COUNT(vmc.id) as total_movimientos,
        json_agg(
          json_build_object(
            'id', vmc.id,
            'concepto', vmc.concepto,
            'cantidad', vmc.cantidad,
            'fecha_movimiento', vmc.fecha_movimiento,
            'id_servicio', vmc.id_servicio,
            'nombre_empleado', vmc.nombre_empleado,
            'id_producto', vmc.id_producto,
            'nombre_producto', vmc.nombre_producto
          ) ORDER BY vmc.fecha_movimiento DESC
        ) FILTER (WHERE vmc.id IS NOT NULL) as movimientos
      FROM tipo_movimientos tm
      LEFT JOIN vista_movimientos_completa vmc ON ${joinConditions}
      WHERE tm.estado = true
      GROUP BY tm.id, tm.nombre
      ORDER BY tm.id;
    `;

    const resultados = await this.sequelize.query(query, {
      replacements: params,
      type: QueryTypes.SELECT
    });

    // Formatear respuesta según estructura esperada
    const respuesta = {};
    resultados.forEach(resultado => {
      respuesta[resultado.tipo_movimiento] = {
        total_monetario: parseFloat(resultado.total_monetario || 0),
        movimientos: resultado.movimientos || []
      };
    });

    return respuesta;
  }

  // Método heredado mantenido para compatibilidad
  agruparMovimientos(movs, ventasExternas = [], devolucionesExternas = [], comprasProcesadas = null) {
    // Este método se mantiene solo para compatibilidad si es necesario
    // pero la nueva implementación usa las vistas directamente
    return this.obtenerMovimientosAgrupados({});
  }

  soloFecha(date) {
    if (!date) return null;
    let d = date;
    if (typeof date === 'string') d = new Date(date);
    if (!(d instanceof Date) || isNaN(d)) return null;
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  async create(data) {
    try {
      await models.Movimiento.create(data);
      return 'Movimiento creado correctamente';
    } catch (err) {
      throw boom.badRequest(err);
    }
  }

  async findAll() {
    // Usar vista_movimientos_por_tipo para obtener resumen completo
    const query = `
      SELECT
        tipo_movimiento,
        total_movimientos,
        total_monetario,
        promedio_movimiento,
        minimo_movimiento,
        maximo_movimiento,
        primera_fecha,
        ultima_fecha
      FROM vista_movimientos_por_tipo
      ORDER BY total_monetario DESC;
    `;

    const resumen = await this.sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    return {
      resumen_por_tipo: resumen,
      detalle_completo: await this.obtenerMovimientosAgrupados({ incluirExternos: true })
    };
  }

  async findOne(id) {
    const query = `
      SELECT * FROM vista_movimientos_completa
      WHERE id = :id;
    `;

    const movimientos = await this.sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    if (!movimientos.length) {
      throw boom.notFound('Movimiento no encontrado');
    }

    return { message: 'Movimiento encontrado', data: movimientos[0] };
  }

  async findDiarios({ fecha_dia, id_servicio }) {
    let whereConditions = ["fecha_movimiento = :fecha_dia"];
    let params = { fecha_dia };

    if (id_servicio) {
      whereConditions.push("id_servicio = :id_servicio");
      params.id_servicio = id_servicio;
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT
        fecha_movimiento,
        año,
        mes,
        dia,
        nombre_dia,
        servicio_nombre,
        tipo_movimiento_nombre,
        total_movimientos,
        total_monetario,
        promedio_movimiento
      FROM vista_movimientos_diarios
      WHERE ${whereClause}
      ORDER BY tipo_movimiento_nombre;
    `;

    const resultados = await this.sequelize.query(query, {
      replacements: params,
      type: QueryTypes.SELECT
    });

    return {
      fecha: fecha_dia,
      resumen_del_dia: resultados,
      detalle_completo: await this.obtenerMovimientosAgrupados({
        fechaInicio: fecha_dia,
        fechaFin: fecha_dia,
        id_servicio
      })
    };
  }

    async findMensuales({ fecha_mes, año, id_servicio }) {
    let whereConditions = ["año = $1", "mes = $2"];
    let params = [año.toString(), fecha_mes.toString()];

    if (id_servicio) {
      whereConditions.push("id_servicio = $3");
      params.push(id_servicio);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT
        año,
        mes,
        año_mes,
        nombre_mes,
        servicio_nombre,
        tipo_movimiento_nombre,
        total_movimientos,
        total_monetario,
        promedio_movimiento
      FROM vista_movimientos_mensuales
      WHERE ${whereClause}
      ORDER BY tipo_movimiento_nombre;
    `;

    const resultados = await this.sequelize.query(query, {
      bind: params,
      type: QueryTypes.SELECT
    });

    const primerDia = new Date(año, fecha_mes - 1, 1);
    const ultimoDia = new Date(año, fecha_mes, 0);

    return {
      periodo: `${fecha_mes}/${año}`,
      resumen_mensual: resultados,
      detalle_completo: await this.obtenerMovimientosAgrupados({
        fechaInicio: primerDia,
        fechaFin: ultimoDia,
        id_servicio
      })
    };
  }

    async findTrimestrales({ numero_trimestre, año, id_servicio }) {
    let whereConditions = ["año = $1", "trimestre = $2"];
    let params = [año.toString(), numero_trimestre.toString()];

    if (id_servicio) {
      whereConditions.push("id_servicio = $3");
      params.push(id_servicio);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT
        año,
        trimestre,
        año_trimestre,
        nombre_trimestre,
        servicio_nombre,
        tipo_movimiento_nombre,
        total_movimientos,
        total_monetario,
        promedio_movimiento
      FROM vista_movimientos_trimestrales
      WHERE ${whereClause}
      ORDER BY tipo_movimiento_nombre;
    `;

    const resultados = await this.sequelize.query(query, {
      bind: params,
      type: QueryTypes.SELECT
    });

    const inicioMes = (numero_trimestre - 1) * 3;
    const finMes = inicioMes + 2;
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes + 1, 0);

    return {
      periodo: `Q${numero_trimestre} ${año}`,
      resumen_trimestral: resultados,
      detalle_completo: await this.obtenerMovimientosAgrupados({
        fechaInicio: primerDia,
        fechaFin: ultimoDia,
        id_servicio
      })
    };
  }

    async findSemestrales({ numero_semestre, año, id_servicio }) {
    let whereConditions = ["año = $1", "semestre = $2"];
    let params = [año.toString(), numero_semestre.toString()];

    if (id_servicio) {
      whereConditions.push("id_servicio = $3");
      params.push(id_servicio);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT
        año,
        semestre,
        nombre_semestre,
        servicio_nombre,
        tipo_movimiento_nombre,
        total_movimientos,
        total_monetario,
        promedio_movimiento
      FROM vista_movimientos_semestrales
      WHERE ${whereClause}
      ORDER BY tipo_movimiento_nombre;
    `;

    const resultados = await this.sequelize.query(query, {
      bind: params,
      type: QueryTypes.SELECT
    });

    const inicioMes = (numero_semestre - 1) * 6;
    const finMes = inicioMes + 5;
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes + 1, 0);

    return {
      periodo: `S${numero_semestre} ${año}`,
      resumen_semestral: resultados,
      detalle_completo: await this.obtenerMovimientosAgrupados({
        fechaInicio: primerDia,
        fechaFin: ultimoDia,
        id_servicio
      })
    };
  }

  async findAnuales({ año, id_servicio }) {
    let whereConditions = ["año = $1"];
    let params = [año.toString()];

    if (id_servicio) {
      whereConditions.push("id_servicio = $2");
      params.push(id_servicio);
    }

    const whereClause = whereConditions.join(' AND ');

    const query = `
      SELECT
        año,
        servicio_nombre,
        tipo_movimiento_nombre,
        total_movimientos,
        total_monetario,
        promedio_movimiento
      FROM vista_movimientos_anuales
      WHERE ${whereClause}
      ORDER BY tipo_movimiento_nombre;
    `;

    const resultados = await this.sequelize.query(query, {
      bind: params,
      type: QueryTypes.SELECT
    });

    const primerDia = new Date(año, 0, 1);
    const ultimoDia = new Date(año, 11, 31);

    return {
      periodo: año,
      resumen_anual: resultados,
      detalle_completo: await this.obtenerMovimientosAgrupados({
        fechaInicio: primerDia,
        fechaFin: ultimoDia,
        id_servicio
      })
    };
  }

  // Mantener método para obtener salarios usando la función SQL
  async obtenerSalarios() {
  const asignaciones = await models.EmpleadoAsignacion.findAll({
    where: { estado: true },
    include: [
      { model: models.Empleado, as: 'empleado', where: { estado: true } },
      { model: models.Rol, as: 'rol' },
      { model: models.Areas, as: 'area', include: [{ model: models.Servicio, as: 'servicio' }] }
    ]
  });

    if (!asignaciones.length) {
      throw boom.notFound('No hay empleados activos con rol asignado');
    }

  const fechaActual = new Date();
  const fechaISO = fechaActual.toISOString().split('T')[0];
  const mesActual = fechaISO.slice(0, 7);
  const [anio, mes] = mesActual.split('-');
  const ultimoDia = new Date(anio, mes, 0).getDate();
  const finMes = `${mesActual}-${ultimoDia}`;

  const movimientos = await Promise.all(asignaciones.map(async asig => {
    const nombre = `${asig.empleado.nombres} ${asig.empleado.apellidos}`.trim();
    const yaPagado = await models.Movimiento.findOne({
      where: {
        id_tipo_movimiento: 1,
        nombre_empleado: nombre,
        fecha_movimiento: { [Op.gte]: `${mesActual}-01`, [Op.lte]: finMes }
      }
    });
    return yaPagado ? null : {
      id_tipo_movimiento: 1,
      id_servicio: asig.area?.servicio?.id,
      concepto: `Pago de salario para rol ${asig.rol.descripcion}`,
      cantidad: asig.rol.salario,
        fecha_movimiento: fechaISO,
      nombre_empleado: nombre,
      estado: true,
    };
  }));

  const nuevos = movimientos.filter(Boolean);
    if (!nuevos.length) {
      return { message: 'Ya se pagaron los salarios de este mes', salarios: [] };
    }

  const result = await models.Movimiento.bulkCreate(nuevos, { returning: true });
  const salarios = result.map(mov => {
    const obj = mov.toJSON();
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
  });

  return { message: 'Salarios pagados e insertados como movimientos', salarios };
}

  // Simplificar método de órdenes
  async obtenerOrdenes({ desde, hasta }) {
    const existentes = await models.Movimiento.findAll({
      where: { id_tipo_movimiento: 2 },
      attributes: ['concepto', 'cantidad', 'fecha_movimiento', 'id_servicio']
    });

    const claves = new Set(existentes.map(m =>
      [`Pago de orden ${m.concepto.split(' ').pop()}`, Number(m.cantidad).toFixed(2), new Date(m.fecha_movimiento).toISOString().split('T')[0], m.id_servicio].join('_')
    ));

    let ordenes;
    try {
      const { data } = await axios.get('http://64.23.169.22:3000/administracion/GET/ordenes', { params: { desde, hasta } });
      ordenes = Array.isArray(data.ordenes) ? data.ordenes : [];
    } catch {
      throw boom.badGateway('No se pudo obtener datos del microservicio de órdenes');
    }

    const nuevas = ordenes.filter(o => {
      const clave = [`Pago de orden ${o.id}`, Number(o.costo_total).toFixed(2), new Date(o.fecha_orden).toISOString().split('T')[0], o.id_servicio].join('_');
      return !claves.has(clave);
    });

    if (!nuevas.length) {
      return { message: 'No hay nuevas órdenes para insertar', data: [] };
    }

    const insertados = await models.Movimiento.bulkCreate(nuevas.map(o => ({
      id_tipo_movimiento: 2,
      id_servicio: o.id_servicio,
      concepto: `Pago de orden ${o.id}`,
      cantidad: o.costo_total,
      fecha_movimiento: o.fecha_orden,
      estado: true,
    })));

    return { message: 'Órdenes insertadas como movimientos', data: insertados };
  }

  // Método para obtener resumen por tipo usando vista SQL
  async getResumenPorTipo() {
    const query = `
      SELECT
        tipo_movimiento_id,
        tipo_movimiento,
        descripcion,
        total_movimientos,
        total_monetario,
        promedio_movimiento,
        minimo_movimiento,
        maximo_movimiento,
        primera_fecha,
        ultima_fecha
      FROM vista_movimientos_por_tipo
      ORDER BY total_monetario DESC;
    `;

    const resultados = await this.sequelize.query(query, {
      type: QueryTypes.SELECT
    });

    return {
      resumen_por_tipo: resultados,
      total_tipos: resultados.length,
      total_general: resultados.reduce((sum, tipo) => sum + parseFloat(tipo.total_monetario || 0), 0)
    };
  }

  // Nuevo método para usar la función SQL obtener_movimientos_por_tipo
  async obtenerMovimientosPorTipo(tipoMovimientoId) {
    const query = `SELECT * FROM obtener_movimientos_por_tipo(:tipoMovimientoId);`;

    const resultados = await this.sequelize.query(query, {
      replacements: { tipoMovimientoId },
      type: QueryTypes.SELECT
    });

    return {
      tipo_movimiento_id: tipoMovimientoId,
      total_movimientos: resultados.length,
      movimientos: resultados
    };
  }
}

module.exports = MovimientosService;
