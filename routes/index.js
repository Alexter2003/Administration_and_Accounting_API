const express = require('express');
const alertaRouter = require('./routers/alerta.router');
const proveedorRouter = require('./routers/proveedores.router');
const empleadoRouter = require('./routers/empleados.router');
const autenticacionRouter = require('./routers/autenticacion.router');
const asistenciasRouter = require('./routers/asistencias.router');
const orderRouter = require('./routers/orden.router');
const jornadaRouter = require('./routers/jornadas.router');
const rolesrouter = require('./routers/roles.router');
const areasRouter = require('./routers/areas.router');
const estadosDetalleRouter = require('./routers/estados_detalle.router');
const estadosOrdenRouter = require('./routers/estados_orden.router');
const serviciosRouter = require('./routers/servicios.router');
const movimientosRouter = require('./routers/movimientos.router');
const reembolsosRouter  = require('./routers/reembolsos.router');
const tipoMovimientoRouter = require('./routers/tipo_movimiento.router');


function routerApi(app) {
  const router = express.Router();
  app.use('/administracion', router);
  router.use(alertaRouter);
  router.use(proveedorRouter);
  router.use(empleadoRouter);
  router.use(autenticacionRouter);
  router.use(asistenciasRouter);
  router.use(estadosDetalleRouter);
  router.use(estadosOrdenRouter);
  router.use(orderRouter);
  router.use(jornadaRouter);
  router.use(rolesrouter);
  router.use(areasRouter);
  router.use(serviciosRouter);

  router.use(movimientosRouter);
  router.use('/POST/reembolsos', reembolsosRouter);
  router.use('/GET/tipo_movimientos', tipoMovimientoRouter);


}

module.exports = routerApi;
