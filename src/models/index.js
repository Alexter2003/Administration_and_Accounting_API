const { AlertaSchema, Alerta } = require('./alerta.model');
const { Areas, AreasSchema } = require('./areas.model');
const { Asistencia, AsistenciaSchema } = require('./asistencia.model');
const { Empleado, EmpleadoSchema } = require('./empleado.model');
const {
  EmpleadoAsignacion,
  EmpleadoAsignacionSchema,
} = require('./empleado_asignacion.model');
const {
  EstadoDetalle,
  EstadoDetalleSchema,
} = require('./estado_detalle.model');
const { EstadoOrden, EstadoOrdenSchema } = require('./estado_orden.model');
const { Jornada, JornadaSchema } = require('./jornada.model');
const { Movimiento, MovimientoSchema } = require('./movimiento.model');
const { Orden, OrdenesSchema } = require('./orden.model');
const { OrdenDetalle, OrdenDetalleSchema } = require('./orden_detalle.model');
const { Proveedor, ProveedoresSchema } = require('./proveedores.model');
const { Rol, RolSchema } = require('./rol.model');
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
  EstadoOrden.init(EstadoOrdenSchema, EstadoOrden.config(sequelize));
  EstadoDetalle.init(EstadoDetalleSchema, EstadoDetalle.config(sequelize));
  Orden.init(OrdenesSchema, Orden.config(sequelize));
  OrdenDetalle.init(OrdenDetalleSchema, OrdenDetalle.config(sequelize));
  Areas.init(AreasSchema, Areas.config(sequelize));
  Jornada.init(JornadaSchema, Jornada.config(sequelize));
  Empleado.init(EmpleadoSchema, Empleado.config(sequelize));
  Rol.init(RolSchema, Rol.config(sequelize));
  EmpleadoAsignacion.init(
    EmpleadoAsignacionSchema,
    EmpleadoAsignacion.config(sequelize)
  );
  Asistencia.init(AsistenciaSchema, Asistencia.config(sequelize));

  //definir las asociaciones
  Servicio.associate(sequelize.models);
  TipoMovimiento.associate(sequelize.models);
  Movimiento.associate(sequelize.models);
  Alerta.associate(sequelize.models);
  EstadoOrden.associate(sequelize.models);
  EstadoDetalle.associate(sequelize.models);
  Proveedor.associate(sequelize.models);
  Orden.associate(sequelize.models);
  OrdenDetalle.associate(sequelize.models);
  Areas.associate(sequelize.models);
  Jornada.associate(sequelize.models);
  Empleado.associate(sequelize.models);
  Rol.associate(sequelize.models);
  EmpleadoAsignacion.associate(sequelize.models);
  Asistencia.associate(sequelize.models);
}

module.exports = setupModels;
