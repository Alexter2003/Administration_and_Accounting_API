const { Model, DataTypes, Sequelize } = require('sequelize');

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
