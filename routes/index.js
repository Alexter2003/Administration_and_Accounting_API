const express = require('express');
const alertaRouter = require('./routers/alerta.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion', router);
  router.use('/alertas', alertaRouter);
}

module.exports = routerApi;
