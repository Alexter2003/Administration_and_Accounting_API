const joi = require('joi');
const id = joi.number().integer();
const id_jornada = joi.number().integer();
const dpi = joi.string().regex(/^[0-9]{13}$/);
const nombres = joi.string().min(3).max(100);
const apellidos = joi.string().min(3).max(100);
const telefono = joi.string().regex(/^[0-9]{8}$/);
const direccion = joi.string().min(3).max(255);
const nit = joi.string();
const genero = joi.boolean();
const email = joi.string().email().min(3).max(100);
//const estado = joi.boolean();
//const usuario = joi.string().min(3).max(50);
//const password = joi.string().min(8).max(255);

const getEmpleadoSchema = joi.object({
  id: id.required(),
});

const createEmpleadoSchema = joi.object({
  dpi: dpi.required(),
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  telefono: telefono.required(),
  direccion: direccion.required(),
  nit: nit.required(),
  genero: genero.required(),
  id_jornada: id_jornada.required(),
  email: email.required(),
});

const updateEmpleadoSchema = joi.object({
  dpi: dpi,
  nombres: nombres,
  apellidos: apellidos,
  telefono: telefono,
  direccion: direccion,
  nit: nit,
  genero: genero,
  id_jornada: id_jornada,
  email: email,
});

const deleteEmpleadoSchema = joi.object({
  id: id.required(),
});

module.exports = { getEmpleadoSchema, createEmpleadoSchema, updateEmpleadoSchema, deleteEmpleadoSchema };
