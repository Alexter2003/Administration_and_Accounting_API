const { Model, DataTypes } = require('sequelize');

const ESTADO_DETALLE_TABLE = 'estado_detalle';

const EstadoDetalleSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(45),
    unique: true,
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
  created_at: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: DataTypes.NOW,
  },
};

class EstadoDetalle extends Model {
  static associate(models) {
    this.hasMany(models.OrdenDetalle, {
      as: 'orden_detalles',
      foreignKey: 'id_estado_detalle',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ESTADO_DETALLE_TABLE,
      modelName: 'EstadoDetalle',
      timestamps: true,
    };
  }
}

module.exports = {
  ESTADO_DETALLE_TABLE,
  EstadoDetalleSchema,
  EstadoDetalle,
};
