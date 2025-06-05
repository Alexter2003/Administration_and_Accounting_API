const Joi = require('joi');

const id = Joi.number().integer();
const nombres = Joi.string().min(3).max(100);
const apellidos = Joi.string().min(3).max(100);
const telefono = Joi.number().integer().max(99999999).min(10000000);
const nit = joi.string();
//const estado = Joi.boolean();

const getProveedorSchema = Joi.object({
  id: id.required(),
});

const createProveedorSchema = Joi.object({
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  telefono: telefono.required(),
  nit: nit.required(),
});

const updateProveedorSchema = Joi.object({
  nombres: nombres,
  apellidos: apellidos,
  telefono: telefono,
  nit: nit,
});

const deleteProveedorSchema = Joi.object({
  id: id.required(),
});

module.exports = { getProveedorSchema, createProveedorSchema, updateProveedorSchema, deleteProveedorSchema };
