const boom = require('@hapi/boom');
const axios = require('axios');
const { models } = require('../config/sequelize');
const { Op } = require('sequelize');

class MovimientosService {
  async obtenerMovimientosAgrupados({ fechaInicio, fechaFin, id_servicio, incluirExternos = false }) {
    const where = { estado: true };
    if (id_servicio) where.id_servicio = id_servicio;
    let movs = await models.Movimiento.findAll({ where });

    // Filtro de fechas robusto
    if (fechaInicio && fechaFin) {
      const inicio = this.soloFecha(fechaInicio);
      const fin = this.soloFecha(fechaFin);
      movs = movs.filter(mov => {
        let fechaMov;
        if (typeof mov.fecha_movimiento === 'string' && mov.fecha_movimiento.includes('/')) {
          const [dia, mes, anio] = mov.fecha_movimiento.split('/');
          fechaMov = new Date(anio, mes - 1, dia);
        } else {
          fechaMov = new Date(mov.fecha_movimiento);
        }
        if (inicio.getTime() === fin.getTime()) {
          return (
            fechaMov.getFullYear() === inicio.getFullYear() &&
            fechaMov.getMonth() === inicio.getMonth() &&
            fechaMov.getDate() === inicio.getDate()
          );
        }
        return fechaMov.getTime() >= inicio.getTime() && fechaMov.getTime() <= fin.getTime();
      });
    }

    // Procesa compras para obtener id_producto
    const compras = await Promise.all(
      movs.filter(m => m.id_tipo_movimiento === 2).map(async compra => {
        try {
          const ordenId = compra.concepto.split(' ').pop();
          const { data } = await axios.get(`http://64.23.169.22:3000/administracion/GET/ordenes/${ordenId}`);
          const detalles = data.orden?.orden_detalles || [];
          return detalles.length
            ? detalles.map(det => ({
                id: compra.id,
                concepto: compra.concepto,
                cantidad: Number(compra.cantidad),
                fecha_movimiento: new Date(compra.fecha_movimiento).toISOString().split('T')[0],
                id_servicio: compra.id_servicio,
                id_producto: det.id_producto
              }))
            : [{
                id: compra.id,
                concepto: compra.concepto,
                cantidad: Number(compra.cantidad),
                fecha_movimiento: new Date(compra.fecha_movimiento).toISOString().split('T')[0],
                id_servicio: compra.id_servicio,
                id_producto: null
              }];
        } catch {
          return [{
            id: compra.id,
            concepto: compra.concepto,
            cantidad: Number(compra.cantidad),
            fecha_movimiento: new Date(compra.fecha_movimiento).toISOString().split('T')[0],
            id_servicio: compra.id_servicio,
            id_producto: null
          }];
        }
      })
    );

    // Ahora obtenemos ventas del endpoint y las guardamos si son nuevas
    let ventasExternasNuevas = [];
    try {
      // Obtenemos ventas externas del endpoint
      const ventasResp = await axios.post('http://64.23.169.22:3001/pagos/transacciones/obtener', {});
      const ventasExternas = (ventasResp.data.Transacciones || []).filter(tx => tx.Estado === 1 && tx.NoFactura);

      // Para cada venta, revisa si ya existe en la base de datos (por NoFactura)
      for (const venta of ventasExternas) {
        // Consideramos que el campo concepto será "Venta externa NoFactura: {NoFactura}"
        const conceptoVenta = `Venta externa NoFactura: ${venta.NoFactura}`;
        // Busca si ya existe un movimiento con ese concepto y tipo de movimiento 3 (por ejemplo)
        const existe = await models.Movimiento.findOne({
          where: {
            concepto: conceptoVenta,
            id_tipo_movimiento: 4,
            estado: true
          }
        });
        if (!existe) {
          // Si no existe, la guardamos
          const nuevaVenta = await models.Movimiento.create({
            concepto: conceptoVenta,
            cantidad: Number(venta.Total),
            fecha_movimiento: new Date(venta.Fecha),
            id_servicio: venta.id_servicio || 3,
            id_tipo_movimiento: 4,
            estado: true
          });
          ventasExternasNuevas.push(nuevaVenta);
        }
      }
    } catch (err) {
      // Si hay error, solo loguea, no detiene el flujo
      console.error('Error obteniendo o guardando ventas externas:', err.message);
    }

    // Ventas y devoluciones externas solo si se piden
    let ventasExternas = [], devolucionesExternas = [];
    if (incluirExternos) {
  const [transResp, devolResp] = await Promise.all([
    axios.post('http://64.23.169.22:3001/pagos/transacciones/obtener', {}), // Cambiado a POST
    axios.post('http://64.23.169.22:3001/pagos/devoluciones/obtener', {})   // Cambiado a POST
  ]);
  const transacciones = (transResp.data.Transacciones || []).filter(tx => tx.Estado === 1);

  devolucionesExternas = (devolResp.data.Devoluciones || [])
    .filter(dev => dev.Estado === 1)
    .filter(dev => {
      const fechaDev = this.soloFecha(dev.Fecha);
      if (!fechaDev) return false;
      let fechaOk = true, servicioOk = true;
      if (fechaInicio && fechaFin) {
        const inicio = this.soloFecha(fechaInicio);
        const fin = this.soloFecha(fechaFin);
        if (inicio.getTime() === fin.getTime()) {
          fechaOk = fechaDev.getTime() === inicio.getTime();
        } else {
          fechaOk = fechaDev.getTime() >= inicio.getTime() && fechaDev.getTime() <= fin.getTime();
        }
      }
      if (id_servicio) servicioOk = dev.id_servicio == id_servicio;
      return fechaOk && servicioOk;
    })
    .map(dev => ({
      id: dev.NoDevolucion,
      concepto: dev.Descripcion || "Devolución",
      cantidad: dev.Monto,
      fecha_movimiento: new Date(dev.Fecha).toISOString().split('T')[0],
      NotaCredito: dev.NotaCredito
    }));

  ventasExternas = [];
  await Promise.all(transacciones.filter(tx => tx.NoFactura).map(async tx => {
    const fechaTx = this.soloFecha(tx.Fecha);
    if (!fechaTx) return;
    let fechaOk = true, servicioOk = true;
    if (fechaInicio && fechaFin) {
      const inicio = this.soloFecha(fechaInicio);
      const fin = this.soloFecha(fechaFin);
      if (inicio.getTime() === fin.getTime()) {
        fechaOk = fechaTx.getTime() === inicio.getTime();
      } else {
        fechaOk = fechaTx.getTime() >= inicio.getTime() && fechaTx.getTime() <= fin.getTime();
      }
    }
    if (id_servicio) servicioOk = tx.ServiciosTransaccion == id_servicio;
    if (!fechaOk || !servicioOk) return;
    try {
      const factura = (await axios.get(`http://64.23.169.22:3001/pagos/facturas/obtener/${tx.NoFactura}`)).data.factura;
      (factura?.Detalle || []).forEach(prod => {
        ventasExternas.push({
          id: tx.NoTransaccion,
          concepto: tx.NoFactura,
          cantidad: prod.Precio * prod.Cantidad,
          fecha_movimiento: new Date(tx.Fecha).toISOString().split('T')[0],
          id_servicio: tx.ServiciosTransaccion,
          producto: prod.Producto
        });
      });
    } catch {}
  }));
  ventasExternas.sort((a, b) => a.concepto.localeCompare(b.concepto));
}

    return this.agruparMovimientos(
      movs.filter(m => m.id_tipo_movimiento !== 2),
      ventasExternas,
      devolucionesExternas,
      compras.flat()
    );
  }

  agruparMovimientos(movs, ventasExternas = [], devolucionesExternas = [], comprasProcesadas = null) {
    const salarios = movs
      .filter(m => m.id_tipo_movimiento === 1)
      .map(sal => ({
        id: sal.id,
        concepto: sal.concepto,
        cantidad: Number(sal.cantidad),
        fecha_movimiento: new Date(sal.fecha_movimiento).toISOString().split('T')[0],
        id_servicio: sal.id_servicio,
        nombre_empleado: sal.nombre_empleado
      }));

    const compras = (comprasProcesadas || movs
      .filter(m => m.id_tipo_movimiento === 2)
      .map(compra => ({
        id: compra.id,
        concepto: compra.concepto,
        cantidad: Number(compra.cantidad),
        fecha_movimiento: new Date(compra.fecha_movimiento).toISOString().split('T')[0],
        id_servicio: compra.id_servicio,
        id_producto: compra.id_producto
      })));

    const ventas = ventasExternas.map(venta => ({
      ...venta,
      cantidad: Number(venta.cantidad)
    }));

    const devoluciones = devolucionesExternas.map(dev => ({
      ...dev,
      cantidad: Number(dev.cantidad)
    }));

    return {
      "Pago de salarios": {
        total_monetario: salarios.reduce((sum, s) => sum + Number(s.cantidad), 0),
        movimientos: salarios
      },
      "Compras": {
        total_monetario: compras.reduce((sum, c) => sum + Number(c.cantidad), 0),
        movimientos: compras
      },
      "Ventas": {
        total_monetario: ventas.reduce((sum, v) => sum + Number(v.cantidad), 0),
        movimientos: ventas
      },
      "Devoluciones": {
        total_monetario: devoluciones.reduce((sum, d) => sum + Number(d.cantidad), 0),
        movimientos: devoluciones
      }
    };
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
    return await this.obtenerMovimientosAgrupados({ incluirExternos: true });
  }

  async findOne(id) {
    const mov = await models.Movimiento.findByPk(id);
    if (!mov) throw boom.notFound('Movimiento no encontrado');
    return { message: 'Movimiento encontrado', data: mov };
  }

  async findDiarios({ fecha_dia, id_servicio }) {
    return await this.obtenerMovimientosAgrupados({
      fechaInicio: fecha_dia,
      fechaFin: fecha_dia,
      id_servicio,
      incluirExternos: true
    });
  }

  async findMensuales({ fecha_mes, año, id_servicio }) {
    const primerDia = new Date(año, fecha_mes - 1, 1);
    const ultimoDia = new Date(año, fecha_mes, 0);
    return await this.obtenerMovimientosAgrupados({
      fechaInicio: primerDia,
      fechaFin: ultimoDia,
      id_servicio,
      incluirExternos: true
    });
  }

  async findTrimestrales({ numero_trimestre, año, id_servicio }) {
    const inicioMes = (numero_trimestre - 1) * 3;
    const finMes = inicioMes + 2;
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes + 1, 0);
    return await this.obtenerMovimientosAgrupados({
      fechaInicio: primerDia,
      fechaFin: ultimoDia,
      id_servicio,
      incluirExternos: true
    });
  }

  async findSemestrales({ numero_semestre, año, id_servicio }) {
    const inicioMes = (numero_semestre - 1) * 6;
    const finMes = inicioMes + 5;
    const primerDia = new Date(año, inicioMes, 1);
    const ultimoDia = new Date(año, finMes + 1, 0);
    return await this.obtenerMovimientosAgrupados({
      fechaInicio: primerDia,
      fechaFin: ultimoDia,
      id_servicio,
      incluirExternos: true
    });
  }

  async findAnuales({ año, id_servicio }) {
    const primerDia = new Date(año, 0, 1);
    const ultimoDia = new Date(año, 11, 31);
    return await this.obtenerMovimientosAgrupados({
      fechaInicio: primerDia,
      fechaFin: ultimoDia,
      id_servicio,
      incluirExternos: true
    });
  }

  async obtenerSalarios() {
  const asignaciones = await models.EmpleadoAsignacion.findAll({
    where: { estado: true },
    include: [
      { model: models.Empleado, as: 'empleado', where: { estado: true } },
      { model: models.Rol, as: 'rol' },
      { model: models.Areas, as: 'area', include: [{ model: models.Servicio, as: 'servicio' }] }
    ]
  });
  if (!asignaciones.length) throw boom.notFound('No hay empleados activos con rol asignado');
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
      fecha_movimiento: fechaISO, // Siempre ISO
      nombre_empleado: nombre,
      estado: true,
    };
  }));
  const nuevos = movimientos.filter(Boolean);
  if (!nuevos.length) return { message: 'Ya se pagaron los salarios de este mes', salarios: [] };
  const result = await models.Movimiento.bulkCreate(nuevos, { returning: true });
  const salarios = result.map(mov => {
    const obj = mov.toJSON();
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
  });
  return { message: 'Salarios pagados e insertados como movimientos', salarios };
}

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
    if (!nuevas.length) return { message: 'No hay nuevas órdenes para insertar', data: [] };
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
}

module.exports = MovimientosService;
