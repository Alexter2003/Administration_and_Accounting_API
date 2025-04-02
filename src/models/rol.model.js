const { Model, DataTypes } = require('sequelize');

const ROL_TABLE = 'roles';

const RolSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  id_rol_superior: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: 'roles',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(45),
  },
  descripcion: {
    allowNull: false,
    type: DataTypes.STRING(255),
  },
  salario: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
};

class Rol extends Model {
  static associate(models) {
    this.belongsTo(models.Rol, {
      as: 'rol_superior',
      foreignKey: 'id_rol_superior',
    });
    this.hasMany(models.Rol, {
      as: 'rol_inferior',
      foreignKey: 'id_rol_superior',
    });
    this.hasMany(models.EmpleadoAsignacion, {
      as: 'empleado_asignacion',
      foreignKey: 'id_rol',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROL_TABLE,
      modelName: 'Rol',
      timestamps: false,
    };
  }
}

module.exports = {
  ROL_TABLE,
  RolSchema,
  Rol,
};
