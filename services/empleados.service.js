const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function generarPasswordAleatoria(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

async function validarCamposUnicos(data, excludeId = null) {
  // Verificar si el DPI ya existe
  if (data.dpi) {
    const existingDpi = await models.Empleado.findOne({ where: { dpi: data.dpi } });
    if (existingDpi && existingDpi.id !== excludeId) {
      throw boom.conflict('El DPI ya está registrado');
    }
  }

  // Verificar si el teléfono ya existe
  if (data.telefono) {
    const existingTelefono = await models.Empleado.findOne({ where: { telefono: data.telefono } });
    if (existingTelefono && existingTelefono.id !== excludeId) {
      throw boom.conflict('El teléfono ya está registrado');
    }
  }

  // Verificar si el correo electrónico ya existe
  if (data.email) {
    const normalizedEmail = data.email.trim().toLowerCase(); // Normalizar el email
    const existingEmail = await models.Empleado.findOne({ where: { email: normalizedEmail } });
    if (existingEmail && existingEmail.id !== excludeId) {
      throw boom.conflict('El correo electrónico ya está registrado');
    }
  }
}

class EmpleadosService {
  constructor() {}

  async create(data) {
    try {
      await validarCamposUnicos(data);

      // Generar usuario y contraseña
      const firstName = data.nombres.split(' ')[0].toLowerCase();
      const lastName = data.apellidos.split(' ')[0].toLowerCase();
      const dpiSegment = `${data.dpi[0]}${data.dpi[1]}${data.dpi[7]}${data.dpi[8]}`;
      const usuario = `${firstName}${lastName}.${dpiSegment}`;
      const password = generarPasswordAleatoria();
      const hashedPassword = await bcrypt.hash(password, 10);

      const newEmpleado = await models.Empleado.create({
        ...data,
        usuario,
        password: hashedPassword,
      });

      // Excluir datos de la respuesta
      const empleadoData = newEmpleado.toJSON();
      delete empleadoData.password;
      delete empleadoData.usuario;
      delete empleadoData.createdAt;
      delete empleadoData.updatedAt;

      return {
        message: 'Empleado creado correctamente',
        datosEmpleado: {
          ...empleadoData,
        },
        autenticacion: 'Brindar al empleado sus datos inicio de sesión:',
        datosLogin: {
          usuario: usuario,
          contraseniaTemporal: password,
        },
      };
    } catch (error) {
      throw boom.badRequest(error.message);
    }
  }

  async find () {
    try {
      const empleados = await models.Empleado.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        where: {
          estado: true,
        },
        order: [['id', 'ASC']],
      });
      if (empleados.length < 1) {
        throw boom.notFound('No hay empleados activos');
      }
      return {
        message: 'Empleados activos encontrados correctamente',
        data: empleados,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async findOne (id) {
    try {
      const empleado = await models.Empleado.findByPk(id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        where: {
          estado: true
        }
      });

      if (!empleado) {
        throw boom.notFound('Empleado no encontrado');
      }
      if (!empleado.estado) {
        throw boom.conflict('Empleado desactivado');
      }
      return {
        message: 'Empleado encontrado correctamente',
        data: empleado
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

  async update(id, data) {
    try {
      const empleado = await models.Empleado.findByPk(id);
      if (!empleado) {
        throw boom.notFound('Empleado no encontrado');
      }

      await validarCamposUnicos(data, id);

      // Encriptar la nueva contraseña si se proporciona
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedEmpleado = await empleado.update(data);

      // Excluir datos sensibles de la respuesta
      const empleadoData = updatedEmpleado.toJSON();
      delete empleadoData.password;
      delete empleadoData.createdAt;
      delete empleadoData.updatedAt;

      return {
        message: 'Empleado actualizado correctamente',
        data: empleadoData,
      };
    } catch (error) {
      throw boom.badRequest(error.message);
    }
  }

  async delete (id) {
    try {
      const empleado = await models.Empleado.findByPk(id, {
        where: {
          estado: true
        }
      });

      if (!empleado) {
        throw boom.notFound('Empleado no encontrado');
      }
      if (!empleado.estado) {
        throw boom.conflict('Empleado desactivado');
      }
      await empleado.update({ estado: false });
      return {
        message: 'Empleado eliminado correctamente',
      };
    } catch (error) {
      throw boom.badRequest(error);
    }
  }

}

module.exports = EmpleadosService;
