const express = require('express');
const router = express.Router();
const TipoMovimientoController = require('../../src/controllers/tipo_movimiento.controller');
const validator = require('../../middlewares/validator.handler');
const {
  createTipoMovimientoSchema,
  updateTipoMovimientoSchema,
  getTipoMovimientoSchema
} = require('../../Schemas/tipo_movimiento.schema');

const controller = new TipoMovimientoController();

router.get('/',
  controller.findAll
);

router.get('/:id',
  validator(getTipoMovimientoSchema, 'params'),
  controller.findOne
);

router.post('/',
  validator(createTipoMovimientoSchema, 'body'),
  controller.create
);

router.patch('/:id',
  validator(getTipoMovimientoSchema, 'params'),
  validator(updateTipoMovimientoSchema, 'body'),
  controller.update
);

router.delete('/:id',
  validator(getTipoMovimientoSchema, 'params'),
  controller.delete
);

module.exports = router;
