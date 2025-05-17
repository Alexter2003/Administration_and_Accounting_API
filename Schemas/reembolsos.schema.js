const joi = require('joi');

const concepto = joi.string().min(5).max(150).required();
const cantidad = joi.number().positive().required();
const fecha_movimiento = joi.date().iso().required();
const id_servicio = joi.number().integer().required();

const createReembolsoSchema = joi.object({
  concepto,
  cantidad,
  fecha_movimiento,
  id_servicio
});

module.exports = { createReembolsoSchema };
