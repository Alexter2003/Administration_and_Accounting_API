const { AlertaSchema, Alerta } = require('./alerta.model');
const { EstadoOrden } = require('./estado_orden.model');
const { Movimiento, MovimientoSchema } = require('./movimiento.model');
const { Proveedor, ProveedoresSchema } = require('./proveedores.model');
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
  Alerta.init(AlertaSchema, Alerta.config(sequelize));
  Proveedor.init(ProveedoresSchema, Proveedor.config(sequelize));

  //definir las asociaciones
  Servicio.associate(sequelize.models);
  TipoMovimiento.associate(sequelize.models);
  Movimiento.associate(sequelize.models);
  Alerta.associate(sequelize.models);
  EstadoOrden.associate(sequelize.models);
  Proveedor.associate(sequelize.models);
}

module.exports = setupModels;
