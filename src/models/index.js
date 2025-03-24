const { Servicios, ServiciosSchema } = require('./servicios.model');
const {
  TipoMovimiento,
  TipoMovimientoSchema,
} = require('./tipo_movimiento.model');

function setupModels(sequelize) {
  Servicios.init(ServiciosSchema, Servicios.config(sequelize));
  TipoMovimiento.init(TipoMovimientoSchema, TipoMovimiento.config(sequelize));
}

module.exports = setupModels;
