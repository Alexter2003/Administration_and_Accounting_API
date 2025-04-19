const AreasService = require('../../services/areas.service');

const service = new AreasService();

class AreasController {
  async find(req, res, next) {
    try {
      const areas = await service.find();
      res.status(200).json(areas);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const area = await service.findOne(req.params.id);
      res.status(200).json(area);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const area = await service.create(req.body);
      res.status(201).json(area);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const area = await service.update(req.params.id, req.body);
      res.status(200).json(area);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const area = await service.delete(req.params.id);
      res.status(200).json(area);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AreasController;
