const Joi = require('joi');

const id = Joi.number().integer();
const id_servicio = Joi.number().integer();
const id_estado_orden = Joi.number().integer().min(1).max(4);
const id_proveedor = Joi.number().integer();
const fecha_orden = Joi.date().min('now');
//const costo_total = Joi.number().integer();
const id_producto = Joi.number().integer();
const cantidad = Joi.number().integer().positive();
const precio_unitario = Joi.number().integer();
const estado_detalle = Joi.number().integer().valid(1, 2, 3);

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

const updateOrdenSchema = Joi.object({
  estado: id_estado_orden.required(),
});

const updateDetalleSchema = Joi.object({
  estado: estado_detalle.required(),
  cantidad: Joi.when('estado', {
    is: 2,
    then: cantidad.required(),
    otherwise: Joi.forbidden()
  })
});

const reabastecerOrdenSchema = Joi.object({
  id: id.required()
});

module.exports = {
  getOrdenSchema,
  createOrdenSchema,
  updateOrdenSchema,
  updateDetalleSchema,
  reabastecerOrdenSchema
};





