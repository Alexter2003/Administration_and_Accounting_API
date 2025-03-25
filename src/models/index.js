const { Servicios, ServiciosSchema } = require('./servicios.model');
const {
  TipoMovimiento,
  TipoMovimientoSchema,
} = require('./tipo_movimiento.model');

function setupModels(sequelize) {
  //definir los modelos
  Servicios.init(ServiciosSchema, Servicios.config(sequelize));
  TipoMovimiento.init(TipoMovimientoSchema, TipoMovimiento.config(sequelize));

  //definir las asociaciones
  Servicios.associate(sequelize.models);
  TipoMovimiento.associate(sequelize.models);
}

module.exports = setupModels;
