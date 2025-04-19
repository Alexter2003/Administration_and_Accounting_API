const express = require('express');
const JornadasController = require('../../src/controllers/jornadas.controller');
const jornadasController = new JornadasController();
const {
  getJornadaSchema,
} = require('../../Schemas/jornadas.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Obtener todas las jornadas
router.get('/GET/jornadas', (req, res, next) => jornadasController.find(req, res, next));

// Obtener una jornada por su id
router.get('/GET/jornadas/:id',
  validatorHandler(getJornadaSchema, 'params'),
  (req, res, next) => jornadasController.findOne(req, res, next)
);

module.exports = router;
