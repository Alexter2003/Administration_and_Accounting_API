const express = require('express');
const AsistenciasController = require('../../src/controllers/asistencias.controller');
const asistenciasController = new AsistenciasController();
const {
  getAsistenciasByEmpleadoSchema,
  getAsistenciasQuerySchema,
  createAsistenciaSchema,
  updateAsistenciaSchema,
  deleteAsistenciaSchema,
} = require('../../Schemas/asistencias.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Registrar entrada
router.post(
  '/POST/asistencias',
  validatorHandler(createAsistenciaSchema, 'body'),
  (req, res, next) => asistenciasController.create(req, res, next)
);

// Registrar salida
router.patch(
  '/PATCH/asistencias/salida',
  validatorHandler(updateAsistenciaSchema, 'body'),
  (req, res, next) => asistenciasController.updateSalidaByEmpleado(req, res, next)
);

// Obtener asistencias por empleado en un rango de fechas
router.get(
  '/GET/asistencias/empleado/:id',
  validatorHandler(getAsistenciasByEmpleadoSchema, 'params'),
  validatorHandler(getAsistenciasQuerySchema, 'query'),
  (req, res, next) => asistenciasController.findByEmpleado(req, res, next)
);

// Obtener inasistencias por empleado en un rango de fechas
router.get(
  '/GET/inasistencias/empleado/:id',
  validatorHandler(getAsistenciasByEmpleadoSchema, 'params'),
  validatorHandler(getAsistenciasQuerySchema, 'query'),
  (req, res, next) => asistenciasController.findInasistenciasByEmpleado(req, res, next)
);

module.exports = router;
