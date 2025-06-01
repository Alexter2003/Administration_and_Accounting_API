const TipoMovimientoService = require('../../services/tipo_movimiento.service');
const service = new TipoMovimientoService();

class TipoMovimientoController {
  async create(req, res, next) {
    try {
      const data = req.body;
      const result = await service.create(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
  try {
    const { id } = req.query;

    if (id) {
      const result = await service.findOne(id);
      res.json(result);
    } else {
      const result = await service.findAll();
      res.json(result);
    }

  } catch (error) {
    next(error);
  }
}


  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const result = await service.findOne(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }


  async update(req, res, next) {
    try {
      const { id } = req.params;
      const changes = req.body;
      const result = await service.update(id, changes);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await service.delete(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TipoMovimientoController;
