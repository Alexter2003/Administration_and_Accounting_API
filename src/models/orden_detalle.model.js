const { Model, DataTypes, Sequelize } = require('sequelize');
const { ORDENES_TABLE } = require('./orden.model');
const { ESTADO_DETALLE_TABLE } = require('./estado_detalle.model');

const ORDEN_DETALLE_TABLE = 'ordenes_detalle';

const OrdenDetalleSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  id_orden: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ORDENES_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  id_estado_detalle: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ESTADO_DETALLE_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  id_producto: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  cantidad: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  precio_unitario: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  createdAt: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updateAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

class OrdenDetalle extends Model {
  static associate(models) {
    this.belongsTo(models.Orden, {
      as: 'orden',
      foreignKey: 'id_orden',
    });
    this.belongsTo(models.EstadoOrden, {
      as: 'estado_orden',
      foreignKey: 'id_estado_orden',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDEN_DETALLE_TABLE,
      modelName: 'OrdenDetalle',
      timestamps: true,
    };
  }
}

module.exports = {
  ORDEN_DETALLE_TABLE,
  OrdenDetalleSchema,
  OrdenDetalle,
};
