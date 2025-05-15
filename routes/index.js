const express = require('express');
const alertaRouter = require('./routers/alerta.router');
const proveedorRouter = require('./routers/proveedores.router');
const empleadoRouter = require('./routers/empleados.router');
const autenticacionRouter = require('./routers/autenticacion.router');
const asistenciasRouter = require('./routers/asistencias.router');
function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion', router);
  router.use(alertaRouter);
  router.use(proveedorRouter);
  router.use(empleadoRouter);
  router.use(autenticacionRouter);
  router.use(asistenciasRouter);
}

module.exports = routerApi;
