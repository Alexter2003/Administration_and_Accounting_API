const express = require('express');
const alertaRouter = require('./routers/alerta.router');
const proveedorRouter = require('./routers/proveedores.router');
const orderRouter = require('./routers/orden.router');
function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion', router);
  router.use(alertaRouter);
  router.use(proveedorRouter);
  router.use(orderRouter);
}

module.exports = routerApi;
