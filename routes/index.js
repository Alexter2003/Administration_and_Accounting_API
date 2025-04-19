const express = require('express');
const alertaRouter = require('./routers/alerta.router');
const proveedorRouter = require('./routers/proveedores.router');
const rolesrouter = require('./routers/roles.router');
function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion', router);
  router.use(alertaRouter);
  router.use(proveedorRouter);
  router.use(rolesrouter);
}

module.exports = routerApi;
