const express = require('express');
const AlertaController = require('../../src/controllers/alerta.controller');
const alertaController = new AlertaController();
const {
  getAlertaSchema,
  createAlertaSchema,
} = require('../../Schemas/alerta.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Obtener todas las alertas
router.get('/', (req, res, next) => alertaController.find(req, res, next));

// Obtener una alerta por su id
router.get(
  '/:id',
  validatorHandler(getAlertaSchema, 'params'),
  (req, res, next) => alertaController.findOne(req, res, next)
);

// Crear una alerta de tienda de conveniencia
router.post(
  '/tienda_de_conveniencia',
  validatorHandler(createAlertaSchema, 'body'),
  (req, res, next) => alertaController.create_tienda_alerta(req, res, next)
);

module.exports = router;
