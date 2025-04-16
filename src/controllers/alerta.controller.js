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

  async delete_alerta(req, res, next) {
    try {
      await service.delete(req.params.id);
      res.status(200).json({ message: 'Alerta eliminada correctamente' });
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

  async create_gasolinera_alerta(req, res, next) {
    try {
      let data = req.body;
      data = {
        ...data,
        id_servicio: 4,
        mensaje: `Bajo stock de ${data.nombre_producto} en la gasolinera`,
      };
      const alerta = await service.create(data);
      res.status(201).json(alerta);

    } catch (error) {
      next(error);
    }
  }

   async create_repuestos_alerta(req, res, next) {
    try {
      let data = req.body;
      data = {
        ...data,
        id_servicio: 6,
        mensaje: `Bajo stock de ${data.nombre_producto} en el servicio de repuestos`,
      };

      const alerta = await service.create(data);
      res.status(201).json(alerta);
    } catch (error) {
      next(error);
    }
  }

  async create_pintura_alerta(req, res, next) {
    try {
      let data = req.body;
      data = {
        ...data,
        id_servicio: 7,
        mensaje: `Bajo stock de ${data.nombre_producto} en el servicio de pintura`,
      };

      const alerta = await service.create(data);
      res.status(201).json(alerta);
    } catch (error) {
      next(error);
    }
  }


}

module.exports = AlertaController;
