const joi = require('joi');

const id          = joi.number().integer();
const concepto    = joi.string().min(5).max(150);
const cantidad    = joi.number().positive();
const fecha       = joi.date().iso();
const id_producto = joi.number().integer().allow(null);
const nombre_producto  = joi.string().max(45).allow(null);
const nombre_empleado  = joi.string().max(45).allow(null);
const id_servicio = joi.number().integer().required();


const getMovimientoSchema = joi.object({
  id: id.required()
});

const getDiariosSchema = joi.object({
  fecha: fecha.required(),
  id_servicio
});

const getMovimientosQuerySchema = joi.object({
  desde: fecha,
  hasta: fecha,
  id_servicio: joi.number().integer() 
});


const getMensualesSchema = joi.object({
  mes: joi.number().integer().min(1).max(12).required(),
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getTrimestralesSchema = joi.object({
  trimestre: joi.number().integer().min(1).max(4).required(),
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getSemestralesSchema = joi.object({
  semestre: joi.number().integer().min(1).max(2).required(),
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getAnualesSchema = joi.object({
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio
});

const getOrdenesSchema = joi.object({
  id_servicio: joi.number().integer().required(),
  desde: fecha.required(),
  hasta: fecha.required()
});

const getVentasSchema = Joi.object({
  desde: fecha.required(),
  hasta: fecha.required(),
  id_servicio: id_servicio.required()
});

const createMovimientoSchema = joi.object({
  concepto: concepto.required(),
  cantidad: cantidad.required(),
  fecha_movimiento: fecha.required(),
  id_tipo_movimiento: id.required(),
  id_servicio,
  id_producto,
  nombre_producto,
  nombre_empleado,
  estado: joi.boolean().default(true)
});


module.exports = {
  getMovimientoSchema,
  getDiariosSchema,
  getMovimientosQuerySchema,
  getMensualesSchema,
  getTrimestralesSchema,
  getSemestralesSchema,
  getAnualesSchema,
  createMovimientoSchema,
  getOrdenesSchema,
  getVentasSchema

};

