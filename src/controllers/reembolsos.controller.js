const ReembolsosService = require('../../services/movimientos.service');
const service = new ReembolsosService();

class ReembolsosController {
  async create(req, res, next) {
    try {
      const {
        concepto,
        cantidad,
        fecha_movimiento,
        id_tipo_movimiento,
        id_servicio
      } = req.body;

      const nuevoReembolso = await service.create({
        concepto,
        cantidad,
        fecha_movimiento,
        id_tipo_movimiento,
        id_servicio,
        estado: true
      });

      res.status(201).json({
        message: 'Reembolso registrado correctamente',
        data: nuevoReembolso
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReembolsosController;
