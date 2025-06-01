const MovimientosService = require('../../services/movimientos.service');
const service = new MovimientosService();

class MovimientosController {
async findAll(req, res, next) {
  try {
    const resultado = await service.findAll();
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}


  async findOne(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await service.findOne(id);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async findDiarios(req, res, next) {
    try {
      const { fecha_dia, id_servicio } = req.query;
      const resultado = await service.findDiarios({ fecha_dia, id_servicio });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async findMensuales(req, res, next) {
    try {
      const { fecha_mes, año, id_servicio } = req.query;
      const resultado = await service.findMensuales({ fecha_mes, año, id_servicio });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async findTrimestrales(req, res, next) {
    try {
      const { numero_trimestre, año, id_servicio } = req.query;
      const resultado = await service.findTrimestrales({ numero_trimestre, año, id_servicio });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async findSemestrales(req, res, next) {
    try {
      const { numero_semestre, año, id_servicio } = req.query;
      const resultado = await service.findSemestrales({ numero_semestre, año, id_servicio });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async findAnuales(req, res, next) {
    try {
      const { año, id_servicio } = req.query;
      const resultado = await service.findAnuales({ año, id_servicio });
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async pagarSalarios(req, res, next) {
    try {
      const response = await service.obtenerSalarios();
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }


}

module.exports = MovimientosController;
