const AlertaService = require('../../services/alerta.service');

const service = new AlertaService();

class AlertaController {
  async find(req, res, next) {
    try {
      const alertas = await service.find();
      res.status(200).json(alertas);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const alerta = await service.findOne(req.params.id);
      res.status(200).json(alerta);
    } catch (error) {
      next(error);
    }
  }

  async create_tienda_alerta(req, res, next) {
    try {
      let data = req.body;
      data = {
        ...data,
        id_servicio: 5,
        mensaje: `Bajo stock de ${data.nombre_producto} en la tienda de conveniencia`,
      };

      const alerta = await service.create(data);
      res.status(201).json(alerta);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AlertaController;
