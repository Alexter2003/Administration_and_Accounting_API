const joi = require('joi');
const id = joi.number().integer();
const id_jornada = joi.number().integer();
const dpi = joi.string().regex(/^[0-9]{13}$/).messages({
  'string.pattern.base': 'El DPI debe contener exactamente 13 dígitos numéricos.',
  'string.empty': 'El DPI es requerido.',
});
const nombres = joi.string().min(3).max(100);
const apellidos = joi.string().min(3).max(100);
const telefono = joi.string().regex(/^[0-9]{8}$/).messages({
  'string.pattern.base': 'El teléfono debe contener exactamente 8 dígitos numéricos.',
  'string.empty': 'El teléfono es requerido.',
});
const direccion = joi.string().min(3).max(255);
const nit = joi.string();
const genero = joi.boolean();
const email = joi.string().email().min(3).max(100);
//const estado = joi.boolean();
//const usuario = joi.string().min(3).max(50);
//const password = joi.string().min(8).max(255);

// Campos para la asignación
const id_rol = joi.number().integer();
const id_area = joi.number().integer();
const horas_semanales = joi.number().integer();

const getEmpleadoSchema = joi.object({
  id: id.required(),
});

const createEmpleadoSchema = joi.object({
  empleado: joi.object({
    dpi: dpi.required(),
    nombres: nombres.required(),
    apellidos: apellidos.required(),
    telefono: telefono.required(),
    direccion: direccion.required(),
    nit: nit.required(),
    genero: genero.required(),
    id_jornada: id_jornada.required(),
    email: email.required(),
  }).required(),
  asignacion: joi.object({
    id_rol: id_rol.required(),
    id_area: id_area.required(),
    horas_semanales: horas_semanales.required(),
  }).required(),
});

const updateEmpleadoSchema = joi.object({
  empleado: joi.object({
    dpi: dpi.optional(),
    nombres: nombres.optional(),
    apellidos: apellidos.optional(),
    telefono: telefono.optional(),
    direccion: direccion.optional(),
    nit: nit.optional(),
    genero: genero.optional(),
    id_jornada: id_jornada.optional(),
    email: email.optional(),
  }).optional(),
  asignacion: joi.object({
    id_rol: id_rol.optional(),
    id_area: id_area.optional(),
    horas_semanales: horas_semanales.optional(),
  }).optional(),
}).or('empleado', 'asignacion');

const deleteEmpleadoSchema = joi.object({
  id: id.required(),
});

module.exports = { getEmpleadoSchema, createEmpleadoSchema, updateEmpleadoSchema, deleteEmpleadoSchema };
