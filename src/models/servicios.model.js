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

class Servicios extends Model {
  static associate() {
    //relaciones
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SERVICIOS_TABLE,
      modelName: 'Servicios',
      timestamps: false,
    };
  }
}

module.exports = {
  SERVICIOS_TABLE,
  ServiciosSchema,
  Servicios,
};
