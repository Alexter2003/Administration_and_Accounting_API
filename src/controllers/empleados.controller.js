const EmpleadosService = require('../../services/empleados.service');
const service = new EmpleadosService();

class EmpleadosController {
  async find(req, res, next) {
    try {
      const empleados = await service.find();
      res.status(200).json(empleados);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const empleado = await service.findOne(req.params.id);
      res.status(200).json(empleado);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const empleado = await service.create(req.body);
      res.status(201).json(empleado);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const empleado = await service.update(req.params.id, req.body);
      res.status(200).json(empleado);
    } catch (error) {
      next(error);
    }
  }

  async findEmpleadosAnteriores(req, res, next) {
    try {
      const empleado = await service.findEmpleadosAnteriores();
      res.status(200).json(empleado);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const empleado = await service.delete(req.params.id);
      res.status(200).json(empleado);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = EmpleadosController;
