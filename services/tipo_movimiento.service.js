const boom = require('@hapi/boom');
const { models } = require('../config/sequelize');

class TipoMovimientoService {
  async create(data) {
    const nuevo = await models.TipoMovimiento.create(data);
    return { message: 'Tipo de movimiento creado correctamente', data: nuevo };
  }

  async findAll() {
    const lista = await models.TipoMovimiento.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['id', 'ASC']],
    });
    return { message: 'Tipos de movimientos encontrados', tipo_movimientos: lista };
  }

  async findOne(id) {
  const tipo = await models.TipoMovimiento.findByPk(id, {
    attributes: ['id', 'nombre', 'descripcion', 'estado'],
  });
  if (!tipo) throw boom.notFound('Tipo de movimiento no encontrado');
  return {
    message: 'Tipo de movimiento encontrado correctamente',
    tipo_movimiento: tipo,
  };
}


  async update(id, changes) {
    const tipo = await models.TipoMovimiento.findByPk(id);
    if (!tipo) throw boom.notFound('Tipo de movimiento no encontrado');
    const actualizado = await tipo.update(changes);
    return { message: 'Tipo de movimiento actualizado', data: actualizado };
  }

  async delete(id) {
    const tipo = await models.TipoMovimiento.findByPk(id);
    if (!tipo) throw boom.notFound('Tipo de movimiento no encontrado');
    await tipo.destroy();
    return { message: 'Tipo de movimiento eliminado' };
  }
}

module.exports = TipoMovimientoService;
