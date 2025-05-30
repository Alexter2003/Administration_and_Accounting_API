const express = require('express');
const OrdenController = require('./../../src/controllers/orden.controller');
const ordenController = new OrdenController();

const { getOrdenSchema, createOrdenSchema, updateOrdenSchema, updateDetalleSchema, reabastecerOrdenSchema } = require('./../../Schemas/orden.schema');
const validatorHandler = require('./../../middlewares/validator.handler');

const router = express.Router();

//Obtener todas las ordenes
router.get('/GET/ordenes', (req, res, next) => ordenController.find(req, res, next));

//Obtener una orden por su id
router.get('/GET/ordenes/:id',
  validatorHandler(getOrdenSchema, 'params'),
  (req, res, next) => ordenController.findOne(req, res, next)
);

//Crear una orden
router.post('/POST/ordenes',
  validatorHandler(createOrdenSchema, 'body'),
  (req, res, next) => ordenController.create(req, res, next)
);

//Actualizar estado de una orden
router.put('/PUT/ordenes/modificar_estado/:id',
  validatorHandler(getOrdenSchema, 'params'),
  validatorHandler(updateOrdenSchema, 'body'),
  (req, res, next) => ordenController.update(req, res, next)
);

//Actualizar estado de un detalle de orden
router.put('/PUT/ordenes/detalle/:id',
  validatorHandler(getOrdenSchema, 'params'),
  validatorHandler(updateDetalleSchema, 'body'),
  (req, res, next) => ordenController.updateDetalleEstado(req, res, next)
);

//Reabastecer una orden
router.post('/POST/ordenes/reabastecer/:id',
  validatorHandler(reabastecerOrdenSchema, 'params'),
  (req, res, next) => ordenController.reabastecer(req, res, next)
);

module.exports = router;
