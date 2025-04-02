const { Model, DataTypes } = require('sequelize');

const PROVEEDORES_TABLE = 'proveedores';

const ProveedoresSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombres: {
    allowNull: false,
    type: DataTypes.STRING(100),
  },
  apellidos: {
    allowNull: false,
    type: DataTypes.STRING(100),
  },
  telefono: {
    allowNull: false,
    type: DataTypes.STRING(8),
  },
  nit: {
    allowNull: false,
    type: DataTypes.STRING(15),
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

class Proveedor extends Model {
  static associate(models) {
    this.hasMany(models.Orden, {
      as: 'ordenes',
      foreignKey: 'id_proveedor',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PROVEEDORES_TABLE,
      modelName: 'Proveedor',
      timestamps: false,
    };
  }
}

module.exports = {
  PROVEEDORES_TABLE,
  ProveedoresSchema,
  Proveedor,
};
