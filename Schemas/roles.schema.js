const joi = require('joi');

const id = joi.number().integer();
const nombre = joi.string().min(5).max(45);
const descripcion = joi.string().min(5).max(200);
const salario = joi.number().integer().min(0).max(1000000);
const id_rol_superior = joi.number().integer().min(1).max(1000000);
const estado = joi.boolean();;

const getRolSchema = joi.object({
  id: id.required(),
});

const createRolSchema = joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required(),
  salario: salario.required(),
  id_rol_superior: id_rol_superior.optional()
});

const updateRolSchema = joi.object({
  nombre: nombre.required(),
  descripcion: descripcion.required(),
  salario: salario.required(),
  id_rol_superior: id_rol_superior.optional()
});

const deleteRolSchema = joi.object({
  id: id.required(),
});

module.exports = {getRolSchema, createRolSchema, updateRolSchema, deleteRolSchema}
