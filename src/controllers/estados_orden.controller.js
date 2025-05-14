const EstadosOrdenService = require('../../services/estados_orden.service');

const service = new EstadosOrdenService();

class EstadoOrdenController {
  async find(req, res, next) {
    try {
      const estados = await service.find();
      return res.status(200).json(estados);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EstadoOrdenController;
