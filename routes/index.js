const express = require('express');
const alertaRouter = require('./routers/alerta.router');
const proveedorRouter = require('./routers/proveedores.router');
const orderRouter = require('./routers/orden.router');
const jornadaRouter = require('./routers/jornadas.router');
const rolesrouter = require('./routers/roles.router');
const areasRouter = require('./routers/areas.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion', router);
  router.use(alertaRouter);
  router.use(proveedorRouter);
  router.use(orderRouter);
  router.use(jornadaRouter);
  router.use(rolesrouter);
  router.use(areasRouter);
}

module.exports = routerApi;
