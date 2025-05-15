const RolService = require('../../services/roles.service');

const service = new RolService();

class RolController {
  async find(req, res, next) {
    try {
      const roles = await service.find();
      res.status(200).json(roles);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const rol = await service.findOne(req.params.id);
      res.status(200).json(rol);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const rol = await service.create(req.body);
      res.status(201).json(rol);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const rol = await service.delete(req.params.id);
      res.status(200).json(rol);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const rol = await service.update(req.params.id, req.body);
      res.status(200).json(rol);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = RolController;
