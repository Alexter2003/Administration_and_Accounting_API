const Joi = require('joi');

const id = Joi.number().integer();
const nombre_producto = Joi.string().min(5).max(45);

// Se dejan comentadas porque por el momento no se utiliza
// const estado = Joi.boolean();
// const mensaje = Joi.string().min(5).max(200);
// const id_servicio = Joi.number().integer();

const getAlertaSchema = Joi.object({
  id: id.required(),
});

const createAlertaSchema = Joi.object({
  nombre_producto: nombre_producto.required(),
});

const deleteAlertaSchema = Joi.object({
  id: id.required(),
});

module.exports = { getAlertaSchema, createAlertaSchema, deleteAlertaSchema };
