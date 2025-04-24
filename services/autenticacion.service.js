const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class AutenticacionService {
  constructor() {}

  generateRandomPassword(length = 10) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  async login(usuario, password) {
  try {
    // Buscar al empleado por el usuario
    const empleado = await models.Empleado.findOne({
      where: { usuario, estado: true },
      include: [
        {
          model: models.EmpleadoAsignacion,
          as: 'empleado_asignacion',
          include: [
            { model: models.Rol, as: 'rol' },
          ],
        },
      ],
    });

    if (!empleado) {
      return { authenticated: false };
    }

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(password, empleado.password);
    if (!isMatch) {
      return { authenticated: false };
    }

    // Extraer los roles del empleado
    const asignaciones = empleado.empleado_asignacion || [];
    if (asignaciones.length === 0) {
      return {
        authenticated: false,
        message: "El usuario no tiene roles asignados. Contacte al administrador.",
      };
    }

    const roles = asignaciones.map((asignacion) => asignacion.rol.nombre);

    return {
      authenticated: true,
      userData: {
        userId: empleado.id,
        nombre: `${empleado.nombres} ${empleado.apellidos}`,
        usuario: empleado.usuario,
        Rol: roles,
      },
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw boom.internal(error);
  }
}

  async cambiarPassword(usuario, viejaContrasenia, nuevaContrasenia) {
    try {
        const empleado = await models.Empleado.findOne({
            where: { usuario, estado: true },
        });

        if (!empleado) {
            throw boom.notFound('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(viejaContrasenia, empleado.password);
        if (!isMatch) {
            throw boom.unauthorized('Contraseña actual incorrecta');
        }

        const hashedPassword = await bcrypt.hash(nuevaContrasenia, 10);
        await empleado.update({ password: hashedPassword });

        return true;
    } catch (error) {
          throw boom.badRequest(error);
    }
  }

  async restablecerPassword(usuario) {
    try {
      const empleado = await models.Empleado.findOne({
        where: { usuario, estado: true },
      });

      if (!empleado) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      const nuevaContrasenia = this.generateRandomPassword();
      const hashed = await bcrypt.hash(nuevaContrasenia, 10);

      await empleado.update({ password: hashed });

      return {
        success: true,
        message: 'Contraseña restablecida exitosamente',
        datosLogin: {
          usuario: empleado.usuario,
          contraseniaTemporal: nuevaContrasenia
        }
      };
    } catch (error) {
      throw boom.internal('Error al restablecer la contraseña');
    }
  }

}

module.exports = AutenticacionService;
