const { Model, DataTypes } = require('sequelize');
const { SERVICIOS_TABLE } = require('./servicios.model');

const ALERTA_TABLE = 'alertas';

const AlertaSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre_producto: {
    allowNull: false,
    type: DataTypes.STRING(50),
  },
  mensaje: {
    allowNull: true,
    type: DataTypes.STRING(255),
  },
  id_servicio: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: SERVICIOS_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
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

class Alerta extends Model {
  static associate(models) {
    this.belongsTo(models.Servicio, {
      as: 'servicio',
      foreignKey: 'id_servicio',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ALERTA_TABLE,
      modelName: 'Alerta',
      timestamps: true,
    };
  }
}

module.exports = {
  ALERTA_TABLE,
  AlertaSchema,
  Alerta,
};
