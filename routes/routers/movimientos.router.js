const express = require('express');
const MovimientosController = require('../../src/controllers/movimientos.controller');
const validatorHandler = require('../../middlewares/validator.handler');


const {
  getMovimientoSchema,
  createMovimientoSchema,
  getMovimientosQuerySchema,
  getMensualesSchema,
  getTrimestralesSchema,
  getSemestralesSchema,
  getAnualesSchema,
  getDiariosSchema 
} = require('../../Schemas/movimientos.schema');


const router = express.Router();
const movimientosController = new MovimientosController();

// Obtener movimientos con filtros
router.get(
  '/',
  validatorHandler(getMovimientosQuerySchema, 'query'),
  (req, res, next) => movimientosController.findWithFilters(req, res, next)
);

// Obtener un movimiento específico por ID
router.get(
  '/GET/movimientos/:id',
  validatorHandler(getMovimientoSchema, 'params'),
  (req, res, next) => movimientosController.findOne(req, res, next)
);

router.get(
  '/diarios',
  validatorHandler(getDiariosSchema, 'query'),
  (req, res, next) => movimientosController.findDiarios(req, res, next)
);


router.get(
  '/mensuales',
  validatorHandler(getMensualesSchema, 'query'),
  (req, res, next) => movimientosController.findMensuales(req, res, next)
);

router.get(
  '/trimestrales',
  validatorHandler(getTrimestralesSchema, 'query'),
  (req, res, next) => movimientosController.findTrimestrales(req, res, next)
);

router.get(
  '/semestrales',
  validatorHandler(getSemestralesSchema, 'query'),
  (req, res, next) => movimientosController.findSemestrales(req, res, next)
);

router.get(
  '/anuales',
  validatorHandler(getAnualesSchema, 'query'),
  (req, res, next) => movimientosController.findAnuales(req, res, next)
);

// Crear un nuevo movimiento (si se usa además de reembolsos)
router.post(
  '/POST/movimientos',
  validatorHandler(createMovimientoSchema, 'body'),
  (req, res, next) => movimientosController.create(req, res, next)
);

module.exports = router;
