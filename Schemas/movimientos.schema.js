const Joi = require('joi');

// Campos base
const id = Joi.number().integer();
const concepto = Joi.string().min(5).max(150);
const cantidad = Joi.number().positive();
const fecha = Joi.date().iso();
const id_producto = Joi.number().integer().allow(null);
const nombre_producto = Joi.string().max(45).allow(null);
const nombre_empleado = Joi.string().max(45).allow(null);

const id_servicio = Joi.alternatives().try(
  Joi.number().integer(),
  Joi.string().pattern(/^\d+$/).custom((value) => parseInt(value)) 
).optional();



const getMovimientoSchema = Joi.object({
  id: id.required()
});

const getDiariosSchema = Joi.object({
  fecha: fecha.required(),
  id_servicio
});

const getMensualesSchema = Joi.object({
  mes: Joi.number().integer().min(1).max(12).required(),
  año: Joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getTrimestralesSchema = Joi.object({
  trimestre: Joi.number().integer().min(1).max(4).required(),
  año: Joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getSemestralesSchema = Joi.object({
  semestre: Joi.number().integer().min(1).max(2).required(),
  año: Joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getAnualesSchema = Joi.object({
  año: Joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getMovimientosQuerySchema = Joi.object({
  desde: fecha,
  hasta: fecha,
  id_servicio
});

const getOrdenesSchema = Joi.object({
  desde: fecha.required(),
  hasta: fecha.required(),
  id_servicio: id_servicio.required() // este sigue siendo requerido
});

const getVentasSchema = Joi.object({
  desde: fecha.required(),
  hasta: fecha.required(),
  id_servicio: id_servicio.required()
});

const createMovimientoSchema = Joi.object({
  concepto: concepto.required(),
  cantidad: cantidad.required(),
  fecha_movimiento: fecha.required(),
  id_tipo_movimiento: id.required(),
  id_servicio,
  id_producto,
  nombre_producto,
  nombre_empleado,
  estado: Joi.boolean().default(true)
});



module.exports = {
  getMovimientoSchema,
  getDiariosSchema,

  getMensualesSchema,
  getTrimestralesSchema,
  getSemestralesSchema,
  getAnualesSchema,
  getMovimientosQuerySchema,
  createMovimientoSchema,
  getOrdenesSchema,
  

};



