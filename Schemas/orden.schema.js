const Joi = require('joi');

const id = Joi.number().integer();
const id_servicio = Joi.number().integer();
const id_estado_orden = Joi.number().integer();
const id_proveedor = Joi.number().integer();
const fecha_orden = Joi.date().min('now');
const costo_total = Joi.number().integer();
const id_producto = Joi.number().integer();
const cantidad = Joi.number().integer();
const precio_unitario = Joi.number().integer();

const getOrdenSchema = Joi.object({
  id: id.required(),
});

const createOrdenSchema = Joi.object({
  id_servicio: id_servicio.required(),
  id_proveedor: id_proveedor.required(),
  fecha_orden: fecha_orden.required(),
  detalles: Joi.array().items(Joi.object({
    id_producto: id_producto.required(),
    cantidad: cantidad.required(),
    precio_unitario: precio_unitario.required(),
  })).required(),
});

module.exports = { getOrdenSchema, createOrdenSchema };





