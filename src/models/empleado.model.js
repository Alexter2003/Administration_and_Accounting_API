const { Model, DataTypes, Sequelize } = require('sequelize');

const EMPLEADO_TABLE = 'empleados';

const EmpleadoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  id_jornada: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'jornadas',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  dpi: {
    allowNull: false,
    type: DataTypes.STRING(13),
    unique: true,
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
  direccion: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
  nit: {
    allowNull: false,
    type: DataTypes.STRING(15),
  },
  genero: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  usuario: {
    allowNull: false,
    type: DataTypes.STRING(50),
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING(100),
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

class Empleado extends Model {
  static associate(models) {
    this.belongsTo(models.Jornada, {
      as: 'jornada',
      foreignKey: 'id_jornada',
    });
    this.hasMany(models.EmpleadoAsignacion, {
      as: 'empleado_asignacion',
      foreignKey: 'id_empleado',
    });
    this.hasMany(models.Asistencia, {
      as: 'asistencias',
      foreignKey: 'id_empleado',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: EMPLEADO_TABLE,
      modelName: 'Empleado',
      timestamps: true,
    };
  }
}

module.exports = {
  EMPLEADO_TABLE,
  EmpleadoSchema,
  Empleado,
};
