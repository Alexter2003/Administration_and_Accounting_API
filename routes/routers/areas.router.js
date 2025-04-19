const express = require('express');
const AreasController = require('../../src/controllers/areas.controller');
const areasController = new AreasController();
const {
  getAreaSchema,
  createAreaSchema,
  updateAreaSchema,
  deleteAreaSchema,
} = require('../../Schemas/areas.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Obtener todas las areas
router.get('/GET/areas', (req, res, next) => areasController.find(req, res, next));

// Obtener una area por su id
router.get(
  '/GET/areas/:id',
  validatorHandler(getAreaSchema, 'params'),
  (req, res, next) => areasController.findOne(req, res, next)
);

// Crear una area
router.post(
  '/POST/areas',
  validatorHandler(createAreaSchema, 'body'),
  (req, res, next) => areasController.create(req, res, next)
);

// Eliminar una area
router.patch(
  '/PATCH/areas/:id',
  validatorHandler(deleteAreaSchema, 'params'),
  (req, res, next) => areasController.delete(req, res, next)
);

// Actualizar un area
router.put(
  '/PUT/areas/:id',
  validatorHandler(getAreaSchema, 'params'),
  validatorHandler(updateAreaSchema, 'body'),
  (req, res, next) => areasController.update(req, res, next)
)

module.exports = router;
