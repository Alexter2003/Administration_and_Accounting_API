const { Model, DataTypes } = require('sequelize');

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
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.STRING(150),
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

class TipoMovimiento extends Model {
  static associate(models) {
    this.hasMany(models.Movimiento, {
      as: 'movimientos',
      foreignKey: 'id_tipo_movimiento',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIPO_MOVIMIENTO_TABLE,
      modelName: 'TipoMovimiento',
      timestamps: false,
    };
  }
}

module.exports = {
  TIPO_MOVIMIENTO_TABLE,
  TipoMovimientoSchema,
  TipoMovimiento,
};
