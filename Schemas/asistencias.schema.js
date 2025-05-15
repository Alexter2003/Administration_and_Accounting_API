const Joi = require('joi');

const id = Joi.number().integer();
const id_empleado = Joi.number().integer();
const fecha = Joi.date();
const hora_entrada = Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
const hora_salida = Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/);
const fecha_inicio = Joi.date();
const fecha_fin = Joi.date();

const createAsistenciaSchema = Joi.object({
  id_empleado: id_empleado.required(),
  fecha: fecha.required(),
  hora_entrada: hora_entrada.required(),
});

const updateAsistenciaSchema = Joi.object({
  id_empleado: id_empleado.required(),
  fecha: fecha.required(),
  hora_salida: hora_salida.required(),
});

const getAsistenciasByEmpleadoSchema = Joi.object({
  id: id.required(), // parametro en el endpoint
});

const getAsistenciasQuerySchema = Joi.object({
  fecha_inicio: fecha_inicio.required(),
  fecha_fin: fecha_fin.required(),
});

module.exports = {
  createAsistenciaSchema,
  updateAsistenciaSchema,
  getAsistenciasByEmpleadoSchema,
  getAsistenciasQuerySchema
};
