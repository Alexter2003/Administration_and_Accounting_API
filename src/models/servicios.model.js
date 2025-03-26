const { Model, DataTypes } = require('sequelize');

const SERVICIOS_TABLE = 'servicios';

const ServiciosSchema = {
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
    allowNull: false,
    type: DataTypes.STRING(150),
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

class Servicio extends Model {
  static associate(models) {
    this.hasMany(models.Movimiento, {
      as: 'movimientos',
      foreignKey: 'id_servicio',
    });
    this.hasMany(models.Alerta, {
      as: 'alertas',
      foreignKey: 'id_servicio',
    });
    this.hasMany(models.Orden, {
      as: 'ordenes',
      foreignKey: 'id_servicio',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SERVICIOS_TABLE,
      modelName: 'Servicio',
      timestamps: false,
    };
  }
}

module.exports = {
  SERVICIOS_TABLE,
  ServiciosSchema,
  Servicio,
};
