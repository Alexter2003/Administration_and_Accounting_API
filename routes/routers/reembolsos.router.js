const express = require('express');
const ReembolsosController = require('../../src/controllers/reembolsos.controller');
const validatorHandler = require('../../middlewares/validator.handler');
const { createReembolsoSchema } = require('../../Schemas/reembolsos.schema');

const router = express.Router();
const ctrl = new ReembolsosController();

router.post(
  '/',
  validatorHandler(createReembolsoSchema, 'body'),
  (req, res, next) => ctrl.create(req, res, next)
);

module.exports = router;
