const express = require('express');
const alertaRouter = require('./routers/alerta.router');
const proveedorRouter = require('./routers/proveedores.router');
function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion', router);
  router.use('/alertas', alertaRouter);
  router.use('/proveedores', proveedorRouter);
}

module.exports = routerApi;
