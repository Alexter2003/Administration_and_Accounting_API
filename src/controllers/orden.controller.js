const OrdenService = require('./../../services/orden.service');

const service = new OrdenService();

class OrdenController {
  async find(req, res, next) {
    try {
      const ordenes = await service.find();
      res.status(200).json(ordenes);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const orden = await service.findOne(req.params.id);
      res.status(200).json(orden);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const orden = await service.create(req.body);
      res.status(201).json(orden);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrdenController;
