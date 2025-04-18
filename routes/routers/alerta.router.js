const express = require('express');
const AlertaController = require('../../src/controllers/alerta.controller');
const alertaController = new AlertaController();
const {
  getAlertaSchema,
  createAlertaSchema,
  deleteAlertaSchema,
} = require('../../Schemas/alerta.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Obtener todas las alertas
router.get('/', (req, res, next) => alertaController.find(req, res, next));

// Obtener una alerta por su id
router.get(
  'GET/:id',
  validatorHandler(getAlertaSchema, 'params'),
  (req, res, next) => alertaController.findOne(req, res, next)
);

// Crear una alerta de tienda de conveniencia
router.post(
  'POST/tienda_de_conveniencia',
  validatorHandler(createAlertaSchema, 'body'),
  (req, res, next) => alertaController.create_tienda_alerta(req, res, next)
);

// Crear una alerta para gasolinera
router.post(
  'POST/gasolinera',
  validatorHandler(createAlertaSchema, 'body'),
  (req, res, next) => alertaController.create_gasolinera_alerta(req, res, next)
);

//Crear una alerta para repuestos
router.post(
  'POST/repuestos',
  validatorHandler(createAlertaSchema, 'body'),
  (req, res, next) => alertaController.create_repuestos_alerta(req, res, next)
);

//Crear una alerta para el servicio de pintura
router.post(
  '/pintura',
  validatorHandler(createAlertaSchema, 'body'),
  (req, res, next) => alertaController.create_pintura_alerta(req, res, next)
);

router.patch(
  'PATCH/:id',
  validatorHandler(deleteAlertaSchema, 'params'),
  (req, res, next) => alertaController.delete_alerta(req, res, next)
);



module.exports = router;
