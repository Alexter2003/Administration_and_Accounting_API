const boom = require('@hapi/boom');
const moment = require('moment');
const { models, Sequelize } = require('./../config/sequelize');
const { Op } = Sequelize;

class AsistenciasService {
  async create(data) {
    const { id_empleado, fecha, hora_entrada } = data;

    //Normaliza la fecha a solo YYYY-MM-DD
    const fechaSolo = moment(fecha).format('YYYY-MM-DD');

    //Busca si ya existe una asistencia para ese empleado en esa fecha (ignorando la hora)
    const asistenciaExistente = await models.Asistencia.findOne({
      where: {
        id_empleado,
        [Op.and]: [
          Sequelize.where(
            Sequelize.cast(Sequelize.col('fecha'), 'DATE'),
            fechaSolo
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
      fecha: asistencia.fecha,
      hora_entrada: asistencia.hora_entrada,
      hora_salida: asistencia.hora_salida,
    }));
  }

}

module.exports = AsistenciasService;
