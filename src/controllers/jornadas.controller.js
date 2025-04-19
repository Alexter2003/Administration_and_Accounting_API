const JornadasService = require('../../services/jornadas.service');

const service = new JornadasService();

class JornadasController {

  async find (req, res, next) {
    try {
      const jornadas = await service.find();
      return res.status(200).json(jornadas);
    } catch (error) {
      next(error);
    }
  }

  async findOne (req, res, next) {
    try {
      const { id } = req.params;
      const jornada = await service.findOne(id);
      return res.status(200).json(jornada);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JornadasController;
