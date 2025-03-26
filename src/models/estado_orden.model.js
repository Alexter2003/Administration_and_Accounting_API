const { Model, DataTypes } = require('sequelize');

const ESTADO_ORDEN_TABLE = 'estados_orden';

const EstadoOrdenSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(45),
  },
  descripcion: {
    allowNull: true,
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

class EstadoOrden extends Model {
  static associate(models) {
    this.hasMany(models.Orden, {
      as: 'ordenes',
      foreignKey: 'id_estado_orden',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ESTADO_ORDEN_TABLE,
      modelName: 'EstadoOrden',
      timestamps: true,
    };
  }
}

module.exports = {
  ESTADO_ORDEN_TABLE,
  EstadoOrdenSchema,
  EstadoOrden,
};
