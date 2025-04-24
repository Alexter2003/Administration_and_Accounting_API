const MovimientosService = require('../../services/movimientos.service');
const service = new MovimientosService();

class MovimientosController {
  async find(req, res, next) {
    try {
      const movimientos = await service.find();
      res.status(200).json(movimientos);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const movimiento = await service.findOne(id);
      res.status(200).json(movimiento);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = req.body;
      const nuevoMovimiento = await service.create(data);
      res.status(201).json({
        mensaje: 'Movimiento creado exitosamente',
        data: nuevoMovimiento,
      });
    } catch (error) {
      next(error);
    }
  }

  async findWithFilters(req, res, next) {
    try {
      const filtros = req.query;
      const resultado = await service.findWithFilters(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async findDiarios(req, res, next) {
    try {
      const filtros = req.query;
      const resultado = await service.findDiarios(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
  

  async findMensuales(req, res, next) {
    try {
      const filtros = req.query;
      const resultado = await service.findMensuales(filtros);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

async findTrimestrales(req, res, next) {
  try {
    const filtros = req.query;
    const resultado = await service.findTrimestrales(filtros);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

async findSemestrales(req, res, next) {
  try {
    const filtros = req.query;
    const resultado = await service.findSemestrales(filtros);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

async findAnuales(req, res, next) {
  try {
    const filtros = req.query;
    const resultado = await service.findAnuales(filtros);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

}

module.exports = MovimientosController;
