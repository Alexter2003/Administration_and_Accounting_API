const { Model, DataTypes } = require('sequelize');

const ASISTENCIA_TABLE = 'asistencias';

const AsistenciaSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  id_empleado: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'empleados',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  fecha: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  hora_entrada: {
    allowNull: false,
    type: DataTypes.TIME,
  },
  hora_salida: {
    allowNull: false,
    type: DataTypes.TIME,
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

class Asistencia extends Model {
  static associate(models) {
    this.belongsTo(models.Empleado, {
      as: 'empleado',
      foreignKey: 'id_empleado',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ASISTENCIA_TABLE,
      modelName: 'Asistencia',
      timestamps: true,
    };
  }
}

module.exports = {
  ASISTENCIA_TABLE,
  AsistenciaSchema,
  Asistencia,
};
