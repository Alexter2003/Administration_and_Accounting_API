const { Movimiento, MovimientoSchema } = require('./movimiento.model');
const { Servicio, ServiciosSchema } = require('./servicios.model');
const {
  TipoMovimiento,
  TipoMovimientoSchema,
} = require('./tipo_movimiento.model');

function setupModels(sequelize) {
  //definir los modelos
  Servicio.init(ServiciosSchema, Servicio.config(sequelize));
  TipoMovimiento.init(TipoMovimientoSchema, TipoMovimiento.config(sequelize));
  Movimiento.init(MovimientoSchema, Movimiento.config(sequelize));

  //definir las asociaciones
  Servicio.associate(sequelize.models);
  TipoMovimiento.associate(sequelize.models);
  Movimiento.associate(sequelize.models);
}

module.exports = setupModels;
