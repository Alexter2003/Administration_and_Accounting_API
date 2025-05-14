const EstadoDetalleService = require('../../services/estados_detalle.service');

const service = new EstadoDetalleService();

class EstadoDetalleController {
  async find(req, res, next) {
    try {
      const estados = await service.find();
      return res.status(200).json(estados);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EstadoDetalleController;
