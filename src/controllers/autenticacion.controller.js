const AutenticacionService = require('../../services/autenticacion.service');
const service = new AutenticacionService();

class AutenticacionController {

  async login(req, res, next) {
    try {
        const { usuario, password } = req.body;
        const result = await service.login(usuario, password);

        if (!result.authenticated) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            userData: result.userData
        });
    } catch (error) {
        next(error);
    }
  }

  async cambiarPassword(req, res, next) {
    try {
        const { usuario, viejaContrasenia, nuevaContrasenia } = req.body;
        const isChanged = await service.cambiarPassword(usuario, viejaContrasenia, nuevaContrasenia);

        if (!isChanged) {
            return res.status(400).json({
                success: false,
                message: 'No se pudo cambiar la contraseña',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Contraseña cambiada exitosamente',
        });
    } catch (error) {
        next(error);
    }
  }

  async restablecerPassword(req, res, next) {
    try {
      const { usuario } = req.body;
      const result = await service.restablecerPassword(usuario);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contraseña restablecida exitosamente',
        password: result.datosLogin
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = AutenticacionController;
