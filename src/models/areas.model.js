const { Model, DataTypes } = require('sequelize');

const AREAS_TABLE = 'areas';

const AreasSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(75),
    unique: true,
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

class Areas extends Model {
  static associate(models) {
    this.hasMany(models.EmpleadoAsignacion, {
      as: 'empleados_asignaciones',
      foreignKey: 'id_area',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: AREAS_TABLE,
      modelName: 'Areas',
      timestamps: false,
    };
  }
}

module.exports = {
  AREAS_TABLE,
  AreasSchema,
  Areas,
};
