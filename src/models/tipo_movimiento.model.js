const { Model, DataTypes, Sequelize } = require('sequelize');

const TIPO_MOVIMIENTO_TABLE = 'tipo_movimientos';

const TipoMovimientoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(50),
    unique: true,
  },
  descripcion: {
    allowNull: true,
    type: DataTypes.STRING(150),
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  }
};

class TipoMovimiento extends Model {
  static associate(models) {
    this.hasMany(models.Movimiento, {
      as: 'movimientos',
      foreignKey: 'id_tipo_movimiento'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIPO_MOVIMIENTO_TABLE,
      modelName: 'TipoMovimiento',
      timestamps: false
    };
  }
}

module.exports = { TIPO_MOVIMIENTO_TABLE, TipoMovimientoSchema, TipoMovimiento };
