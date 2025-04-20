const joi = require('joi');
const id = joi.number().integer();
//const nombre = joi.string().min(3).max(45);
//const descripcion = joi.string().min(3).max(255);
//const estado = joi.boolean();

const getJornadaSchema = joi.object({
  id: id.required(),
});

module.exports = { getJornadaSchema };
