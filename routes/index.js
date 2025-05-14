const express = require('express');
const alertaRouter = require('./routers/alerta.router');
const proveedorRouter = require('./routers/proveedores.router');
const empleadoRouter = require('./routers/empleados.router');
const autenticacionRouter = require('./routers/autenticacion.router');
const orderRouter = require('./routers/orden.router');
const jornadaRouter = require('./routers/jornadas.router');
const rolesrouter = require('./routers/roles.router');
const areasRouter = require('./routers/areas.router');
const estadosDetalleRouter = require('./routers/estados_detalle.router');
const estadosOrdenRouter = require('./routers/estados_orden.router');
const serviciosRouter = require('./routers/servicios.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion', router);
  router.use(alertaRouter);
  router.use(proveedorRouter);
  router.use(empleadoRouter);
  router.use(autenticacionRouter);
  router.use(orderRouter);
  router.use(jornadaRouter);
  router.use(rolesrouter);
  router.use(areasRouter);
  router.use(estadosDetalleRouter);
  router.use(estadosOrdenRouter);
  router.use(serviciosRouter);
}

module.exports = routerApi;
