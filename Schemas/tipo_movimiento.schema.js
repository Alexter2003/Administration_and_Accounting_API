const Joi = require('joi');

const id = Joi.number().integer();
const nombre = Joi.string().max(50);
const descripcion = Joi.string().max(150);
const estado = Joi.boolean();

const createTipoMovimientoSchema = Joi.object({
  nombre: nombre.required(),
  descripcion,
  estado,
});

const updateTipoMovimientoSchema = Joi.object({
  nombre,
  descripcion,
  estado,
});

const getTipoMovimientoSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createTipoMovimientoSchema,
  updateTipoMovimientoSchema,
  getTipoMovimientoSchema
};
