const ServiciosService = require('../../services/servicios.service');

const service = new ServiciosService();

class ServiciosController {
  async find(req, res, next) {
    try {
      const servicios = await service.find();
      return res.status(200).json(servicios);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const servicio = await service.findOne(id);
      return res.status(200).json(servicio);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ServiciosController;
