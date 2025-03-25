const { Model, DataTypes } = require('sequelize');
const { TIPO_MOVIMIENTO_TABLE } = require('./tipo_movimiento.model');
const { SERVICIOS_TABLE } = require('./servicios.model');

const MOVIMIENTO_TABLE = 'movimientos';

const MovimientoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  id_tipo_movimiento: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: TIPO_MOVIMIENTO_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  id_servicio: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: SERVICIOS_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  concepto: {
    allowNull: false,
    type: DataTypes.STRING(150),
  },
  cantidad: {
    allowNull: false,
    type: DataTypes.DOUBLE,
  },
  fecha_movimiento: {
    allowNull: false,
    type: DataTypes.DATEONLY,
  },
  id_producto: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  nombre_producto: {
    allowNull: true,
    type: DataTypes.STRING(45),
  },
  nombre_empleado: {
    allowNull: true,
    type: DataTypes.STRING(45),
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  created_at: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

class Movimiento extends Model {
  static associate(models) {
    this.belongsTo(models.TipoMovimiento, {
      as: 'tipo_movimiento',
      foreignKey: 'id_tipo_movimiento',
    });
    this.belongsTo(models.Servicio, {
      as: 'servicio',
      foreignKey: 'id_servicio',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MOVIMIENTO_TABLE,
      modelName: 'Movimiento',
      timestamps: true,
    };
  }
}

module.exports = {
  MOVIMIENTO_TABLE,
  MovimientoSchema,
  Movimiento,
};
