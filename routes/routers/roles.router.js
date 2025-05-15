const express = require('express');
const RolesController = require('../../src/controllers/roles.controller');
const rolesController = new RolesController();
const {
  getRolSchema,
  createRolSchema,
  updateRolSchema,
  deleteRolSchema,
} = require('../../Schemas/roles.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();

// Obtener todas los roles
router.get('/GET/roles', (req, res, next) => rolesController.find(req, res, next));

// Obtener un rol por su id
router.get(
  '/GET/roles/:id',
  validatorHandler(getRolSchema, 'params'),
  (req, res, next) => rolesController.findOne(req, res, next)
);

// Crear un rol
router.post(
  '/POST/roles',
  validatorHandler(createRolSchema, 'body'),
  (req, res, next) => rolesController.create(req, res, next)
);

// Eliminar un rol
router.patch(
  '/PATCH/roles/:id',
  validatorHandler(deleteRolSchema, 'params'),
  (req, res, next) => rolesController.delete(req, res, next)
);

// Actualizar un rol
router.put(
  '/PUT/roles/:id',
  validatorHandler(getRolSchema, 'params'),
  validatorHandler(updateRolSchema, 'body'),
  (req, res, next) => rolesController.update(req, res, next)
);

module.exports = router;
