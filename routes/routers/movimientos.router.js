const express = require('express');
const MovimientosController = require('../../src/controllers/movimientos.controller');
const validatorHandler      = require('../../middlewares/validator.handler');
const {
  getMovimientoSchema,
  getDiariosSchema,
  getMensualesSchema,
  getTrimestralesSchema,
  getSemestralesSchema,
  getAnualesSchema,
  getMovimientosQuerySchema,
  getOrdenesSchema,
  getVentasSchema 

} = require('../../Schemas/movimientos.schema');


const router = express.Router();
const ctrl   = new MovimientosController();


router.get(
  '/GET/movimientos/diarios',
  validatorHandler(getDiariosSchema, 'query'),
  (req, res, next) => ctrl.findDiarios(req, res, next)
);

router.get(
  '/GET/movimientos/mensuales',
  validatorHandler(getMensualesSchema, 'query'),
  (req, res, next) => ctrl.findMensuales(req, res, next)
);

router.get(
  '/GET/movimientos/trimestrales',
  validatorHandler(getTrimestralesSchema, 'query'),
  (req, res, next) => ctrl.findTrimestrales(req, res, next)
);

router.get(
  '/GET/movimientos/semestrales',
  validatorHandler(getSemestralesSchema, 'query'),
  (req, res, next) => ctrl.findSemestrales(req, res, next)
);

router.get(
  '/GET/movimientos/anuales',
  validatorHandler(getAnualesSchema, 'query'),
  (req, res, next) => ctrl.findAnuales(req, res, next)
);

router.post(
  '/POST/pagar-salarios',
  (req, res, next) => ctrl.pagarSalarios(req, res, next)
);


router.get(
  '/GET/movimientos',
  validatorHandler(getMovimientosQuerySchema, 'query'),
  (req, res, next) => ctrl.findWithFilters(req, res, next)
);

router.get(
  '/GET/movimientos/ordenes',
  (req, res, next) => ctrl.obtenerOrdenes(req, res, next)
);

router.get(
  '/GET/movimientos/ventas',
  validatorHandler(getVentasSchema, 'query'),
  (req, res, next) => ctrl.obtenerVentas(req, res, next)
);



router.get(
  '/GET/movimientos/:id',
  validatorHandler(getMovimientoSchema, 'params'),
  (req, res, next) => ctrl.findOne(req, res, next)
);



module.exports = router;
