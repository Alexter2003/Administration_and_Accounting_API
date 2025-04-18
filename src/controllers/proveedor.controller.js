const ProveedorService = require('../../services/proveedor.service');

const service = new ProveedorService();

class ProveedorController {

  async find(req, res, next) {
    try {
      const proveedores = await service.find();
      res.status(200).json(proveedores);
    } catch (error) {
      next(error);
    }
  }

  async findOne(req, res, next) {
    try {
      const proveedor = await service.findOne(req.params.id);
      res.status(200).json(proveedor);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const proveedor = await service.create(req.body);
      res.status(201).json(proveedor);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const proveedor = await service.update(req.params.id, req.body);
      res.status(200).json(proveedor);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await service.delete(req.params.id);
      res.status(200).json({ message: 'Proveedor desactivado correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProveedorController;
