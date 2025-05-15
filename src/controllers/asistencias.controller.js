const AsistenciasService = require('../../services/asistencias.service');
const moment = require('moment');

const service = new AsistenciasService();

class AsistenciasController {
  async create(req, res, next) {
    try {
      const asistencia = await service.create(req.body);
      res.status(201).json({
        message: 'Asistencia - Hora de entrada registrada correctamente',
        asistencia: asistencia,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSalidaByEmpleado(req, res, next) {
    try {
      const { id_empleado, fecha, hora_salida } = req.body;

      const asistencia = await service.updateSalidaByEmpleado(id_empleado, fecha, hora_salida);
      res.status(200).json({
        message: 'Asistencia - Hora de salida registrada correctamente',
        asistencia: asistencia,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByEmpleado(req, res, next) {
    try {
      const { id } = req.params;
      const { fecha_inicio, fecha_fin } = req.query;

      const asistencias = await service.findByEmpleado(id, fecha_inicio, fecha_fin);
      res.status(200).json({
        message: 'Asistencias encontradas correctamente',
        asistencias: asistencias,
      });
    } catch (error) {
      next(error);
    }
  }

  async findInasistenciasByEmpleado(req, res, next) {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;
    const data = await service.findInasistenciasPorEmpleado(id, fecha_inicio, fecha_fin);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

}

module.exports = AsistenciasController;
