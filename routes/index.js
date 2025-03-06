const express = require('express');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/administracion/v1', router);
}

module.exports = routerApi;
