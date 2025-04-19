const express = require('express');
const EmpleadosController = require('../../src/controllers/empleados.controller');
const empleadosController = new EmpleadosController();
const {
  getEmpleadoSchema,
  createEmpleadoSchema,
  updateEmpleadoSchema,
  deleteEmpleadoSchema,
} = require('../../Schemas/empleados.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Obtener todos los empleados
router.get('/GET/empleados', (req, res, next) => empleadosController.find(req, res, next));

// Obtener un empleado por su id
router.get('/GET/empleados/:id',
  validatorHandler(getEmpleadoSchema, 'params'),
  (req, res, next) => empleadosController.findOne(req, res, next)
);

// Crear un empleado
router.post('/POST/empleados',
  validatorHandler(createEmpleadoSchema, 'body'),
  (req, res, next) => empleadosController.create(req, res, next)
);

// Actualizar un empleado
router.put('/PUT/empleados/:id',
  validatorHandler(getEmpleadoSchema, 'params'),
  validatorHandler(updateEmpleadoSchema, 'body'),
  (req, res, next) => empleadosController.update(req, res, next)
);

// Eliminar un empleado
router.patch('/PATCH/empleados/:id',
  validatorHandler(deleteEmpleadoSchema, 'params'),
  (req, res, next) => empleadosController.delete(req, res, next)
);

module.exports = router;
