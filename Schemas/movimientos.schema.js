const joi = require('joi');

const id = joi.number().integer();
const concepto = joi.string().min(5).max(150);
const cantidad = joi.number().positive();
const fecha_movimiento = joi.date().iso();
const id_producto = joi.number().integer().allow(null);
const nombre_producto = joi.string().max(45).allow(null);
const nombre_empleado = joi.string().max(45).allow(null);
const id_servicio = joi.number().integer(); 

const createMovimientoSchema = joi.object({
  concepto: concepto.required(),
  cantidad: cantidad.required(),
  fecha_movimiento: fecha_movimiento.required(),
  id_producto,
  nombre_producto,
  nombre_empleado,
  id_tipo_movimiento: id.required(),
  estado: joi.boolean().default(true)
});

const getMovimientoSchema = joi.object({
  id: id.required()
});

const getMovimientosQuerySchema = joi.object({
  tipo: joi.string().valid('salario', 'orden', 'reembolso', 'venta'),
  desde: joi.date().iso(),
  hasta: joi.date().iso(),
  id_servicio: joi.number().integer()
});


const getDiariosSchema = joi.object({
  fecha: joi.date().iso().required(),
  id_servicio: joi.number().integer().required()
});

const getMensualesSchema = joi.object({
  fecha_mes: joi.number().integer().min(1).max(12).required(),
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio: joi.number().integer().required()
});

const getTrimestralesSchema = joi.object({
  trimestre: joi.number().integer().min(1).max(4).required(),
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio: joi.number().integer().required()
});

const getSemestralesSchema = joi.object({
  semestre: joi.number().integer().min(1).max(2).required(),
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio: joi.number().integer().required()
});

const getAnualesSchema = joi.object({
  año: joi.number().integer().min(2000).max(2100).required(),
  id_servicio: joi.number().integer().required()
});


module.exports = {
  createMovimientoSchema,
  getMovimientoSchema,
  getMovimientosQuerySchema, 
  getMensualesSchema,
  getTrimestralesSchema,
  getSemestralesSchema,
  getAnualesSchema,
  getDiariosSchema
};

