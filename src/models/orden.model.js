const { Model, DataTypes, Sequelize } = require('sequelize');
const { SERVICIOS_TABLE } = require('./servicios.model');
const { ESTADO_ORDEN_TABLE } = require('./estado_orden.model');
const { PROVEEDORES_TABLE } = require('./proveedores.model');

const ORDENES_TABLE = 'ordenes';

const OrdenesSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  id_servicio: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: SERVICIOS_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  id_estado_orden: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ESTADO_ORDEN_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  id_proveedor: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PROVEEDORES_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  fecha_orden: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  costo_total: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  createdAt: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

class Orden extends Model {
  static associate(models) {
    this.belongsTo(models.Servicio, {
      as: 'servicio',
      foreignKey: 'id_servicio',
    });
    this.belongsTo(models.EstadoOrden, {
      as: 'estado_orden',
      foreignKey: 'id_estado_orden',
    });
    this.belongsTo(models.Proveedor, {
      as: 'proveedor',
      foreignKey: 'id_proveedor',
    });
    this.hasMany(models.OrdenDetalle, {
      as: 'orden_detalles',
      foreignKey: 'id_orden',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDENES_TABLE,
      modelName: 'Orden',
      timestamps: true,
    };
  }
}

module.exports = {
  ORDENES_TABLE,
  OrdenesSchema,
  Orden,
};
