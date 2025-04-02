const { Model, DataTypes } = require('sequelize');

const JORNADA_TABLE = 'jornadas';

const JornadaSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING(45),
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

class Jornada extends Model {
  static associate(models) {
    this.hasMany(models.Empleado, {
      as: 'empleado',
      foreignKey: 'id_jornada',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: JORNADA_TABLE,
      modelName: 'Jornada',
      timestamps: false,
    };
  }
}

module.exports = {
  JORNADA_TABLE,
  JornadaSchema,
  Jornada,
};
