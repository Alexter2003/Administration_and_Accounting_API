const { Model, DataTypes } = require('sequelize');

const EMPLEADO_ASIGNACION_TABLE = 'empleado_asignaciones';

const EmpleadoAsignacionSchema = {
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
  id_rol: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  id_area: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: 'areas',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  horas_semanales: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

class EmpleadoAsignacion extends Model {
  static associate(models) {
    this.belongsTo(models.Empleado, {
      as: 'empleado',
      foreignKey: 'id_empleado',
    });

    this.belongsTo(models.Rol, {
      as: 'rol',
      foreignKey: 'id_rol',
    });
    this.belongsTo(models.Areas, {
      as: 'area',
      foreignKey: 'id_area',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: EMPLEADO_ASIGNACION_TABLE,
      modelName: 'EmpleadoAsignacion',
      timestamps: false,
    };
  }
}

module.exports = {
  EMPLEADO_ASIGNACION_TABLE,
  EmpleadoAsignacionSchema,
  EmpleadoAsignacion,
};
