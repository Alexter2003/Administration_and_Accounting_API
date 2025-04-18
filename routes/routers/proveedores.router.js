const express = require('express');
const ProveedorController = require('../../src/controllers/proveedor.controller');
const proveedorController = new ProveedorController();
const {
  getProveedorSchema,
  createProveedorSchema,
  updateProveedorSchema,
  deleteProveedorSchema,
} = require('../../Schemas/proveedor.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Obtener todos los proveedores
router.get('/GET', (req, res, next) => proveedorController.find(req, res, next));

// Obtener un proveedor por su id
router.get('/GET/:id',
  validatorHandler(getProveedorSchema, 'params'),
  (req, res, next) => proveedorController.findOne(req, res, next)
);

// Crear un proveedor
router.post('/POST',
  validatorHandler(createProveedorSchema, 'body'),
  (req, res, next) => proveedorController.create(req, res, next)
);

// Actualizar un proveedor
router.put('/PUT/:id',
  validatorHandler(getProveedorSchema, 'params'),
  validatorHandler(updateProveedorSchema, 'body'),
  (req, res, next) => proveedorController.update(req, res, next)
);

// Eliminar un proveedor
router.patch('/PATCH/:id',
  validatorHandler(deleteProveedorSchema, 'params'),
  (req, res, next) => proveedorController.delete(req, res, next)
);




module.exports = router;