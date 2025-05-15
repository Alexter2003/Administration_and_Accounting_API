const boom = require('@hapi/boom');
const moment = require('moment');
const { models, sequelize, Sequelize } = require('./../config/sequelize');
const { inasistencias_por_empleado } = require('../db/queries/queries');
const { Op } = Sequelize;

class AsistenciasService {
  async create(data) {
    const { id_empleado, fecha, hora_entrada } = data;

    //Busca si ya existe una asistencia para ese empleado en esa fecha
    const asistenciaExistente = await models.Asistencia.findOne({
      where: {
        id_empleado,
        [Op.and]: [
          Sequelize.where(
            Sequelize.cast(Sequelize.col('fecha'), 'DATE'),
            fecha
          ),
        ],
      },
    });

    if (asistenciaExistente) {
      throw boom.badRequest('La asistencia ya fue registrada para esta fecha');
    }

    const nuevaAsistencia = await models.Asistencia.create({
      id_empleado,
      fecha,
      hora_entrada,
    });

    return nuevaAsistencia;
  }

  async updateSalidaByEmpleado(id_empleado, fecha, hora_salida) {
    //Buscar la asistencia por empleado y fecha
    const asistencia = await models.Asistencia.findOne({
      where: {
        id_empleado,
        fecha: Sequelize.where(Sequelize.cast(Sequelize.col('fecha'), 'DATE'), fecha), //Comparar solo la fecha
      },
    });

    //Validar si la asistencia existe
    if (!asistencia) {
      throw boom.notFound(`No se encontró una asistencia para el empleado con ID ${id_empleado} en la fecha ${fecha}`);
    }

    if (asistencia.hora_salida) {
      throw boom.conflict('La hora de salida ya fue registrada para esta asistencia');
    }

    //Actualizar la hora de salida
    asistencia.hora_salida = hora_salida;
    await asistencia.save();

    return asistencia;
  }

  async findByEmpleado(id_empleado, fechaInicio, fechaFin) {
    const asistencias = await models.Asistencia.findAll({
      where: {
        id_empleado,
        fecha: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      order: [['fecha', 'ASC']],
    });

    return asistencias.map(asistencia => ({
      fecha: moment(asistencia.fecha).format('YYYY-MM-DD'),
      hora_entrada: asistencia.hora_entrada,
      hora_salida: asistencia.hora_salida,
    }));
  }

  async findInasistenciasPorEmpleado(id_empleado, fecha_inicio, fecha_fin) {
    const [result] = await sequelize.query(inasistencias_por_empleado, {
      replacements: { id_empleado, fecha_inicio, fecha_fin },
      type: Sequelize.QueryTypes.SELECT,
    });

    return {
      no_inasistencias: Number(result.no_inasistencias) || 0,
      inasistencias: result.inasistencias ? result.inasistencias.filter(Boolean) : [],
    };
  }

}

module.exports = AsistenciasService;
