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
router.get('/GET/proveedores', (req, res, next) => proveedorController.find(req, res, next));

// Obtener un proveedor por su id
router.get('/GET/proveedores/:id',
  validatorHandler(getProveedorSchema, 'params'),
  (req, res, next) => proveedorController.findOne(req, res, next)
);

// Crear un proveedor
router.post('/POST/proveedores',
  validatorHandler(createProveedorSchema, 'body'),
  (req, res, next) => proveedorController.create(req, res, next)
);

// Actualizar un proveedor
router.put('/PUT/proveedores/:id',
  validatorHandler(getProveedorSchema, 'params'),
  validatorHandler(updateProveedorSchema, 'body'),
  (req, res, next) => proveedorController.update(req, res, next)
);

// Eliminar un proveedor
router.patch('/PATCH/proveedores/:id',
  validatorHandler(deleteProveedorSchema, 'params'),
  (req, res, next) => proveedorController.delete(req, res, next)
);




module.exports = router;