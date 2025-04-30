const MovimientosService = require('../../services/movimientos.service');
const service = new MovimientosService();

class ReembolsosController {
  async create(req, res, next) {
    try {
      const body = req.body;
      const reembolso = {
        ...body,
        id_tipo_movimiento: 3, // Tipo 3 = Reembolso
        estado: true
      };
      const result = await service.create(reembolso);
      res.status(201).json({
        message: 'Reembolso registrado correctamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReembolsosController;
