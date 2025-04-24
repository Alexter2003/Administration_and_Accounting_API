const express = require('express');
const ReembolsosController = require('../../src/controllers/reembolsos.controller');
const { createReembolsoSchema } = require('../../Schemas/reembolso.schema');
const validatorHandler = require('../../middlewares/validator.handler');

const router = express.Router();
const controller = new ReembolsosController();

router.post(
  '/',
  validatorHandler(createReembolsoSchema, 'body'),
  (req, res, next) => controller.create(req, res, next)
);

module.exports = router;
