const joi = require('joi');
const id = joi.number().integer();
const nombre = joi.string().min(5).max(45);
const descripcion = joi.string().min(5).max(200);
const estado = joi.boolean();

const getAreaSchema = joi.object({
  id: id.required(),
});

const createAreaSchema = joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required()
});

const deleteAreaSchema = joi.object({
  id: id.required(),
});

const updateAreaSchema = joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required()
});

module.exports = { getAreaSchema, createAreaSchema, deleteAreaSchema, updateAreaSchema };
