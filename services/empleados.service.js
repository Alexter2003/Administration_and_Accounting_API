const boom = require('@hapi/boom');
const { sequelize, models } = require('./../config/sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function generarPasswordAleatoria(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

async function validarCamposUnicos(data, excludeId = null) {
  const errores = [];

  if (data.dpi) {
    const existingDpi = await models.Empleado.findOne({ where: { dpi: data.dpi } });
    if (existingDpi && existingDpi.id !== excludeId) {
      errores.push('El DPI ya está registrado');
    }
  }

  if (data.telefono) {
    const existingTelefono = await models.Empleado.findOne({ where: { telefono: data.telefono } });
    if (existingTelefono && existingTelefono.id !== excludeId) {
      errores.push('El teléfono ya está registrado');
    }
  }

  if (data.email) {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existingEmail = await models.Empleado.findOne({ where: { email: normalizedEmail } });
    if (existingEmail && existingEmail.id !== excludeId) {
      errores.push('El correo electrónico ya está registrado');
    }
  }

  if (errores.length > 0) {
    throw boom.conflict(errores.join('. '));
  }
}

class EmpleadosService {
  constructor() {}

  async create(data) {
  const t = await sequelize.transaction();
  try {
    // Desestructurar los datos
    const { empleado, asignacion } = data;

    // Validar campos únicos antes de crear el empleado
    await validarCamposUnicos(empleado);

    // Generar usuario y contraseña
    const firstName = empleado.nombres.split(' ')[0].toLowerCase();
    const lastName = empleado.apellidos.split(' ')[0].toLowerCase();
    const dpiSegment = `${empleado.dpi[0]}${empleado.dpi[1]}${empleado.dpi[7]}${empleado.dpi[8]}`;
    const usuario = `${firstName}${lastName}.${dpiSegment}`;
    const password = generarPasswordAleatoria();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmpleado = await models.Empleado.create({
      ...empleado,
      usuario,
      password: hashedPassword,
    }, { transaction: t });

    // Crear la asignación
    await models.EmpleadoAsignacion.create({
      id_empleado: newEmpleado.id,
      id_rol: asignacion.id_rol,
      id_area: asignacion.id_area,
      horas_semanales: asignacion.horas_semanales,
    }, { transaction: t });

    await t.commit();

    // Excluir datos sensibles de la respuesta
    const empleadoData = newEmpleado.toJSON();
    delete empleadoData.password;
    delete empleadoData.createdAt;
    delete empleadoData.updatedAt;

    return {
      message: 'Empleado creado correctamente',
      autenticacion: {
        usuario,
        contraseniaTemporal: password,
      }
    };
    } catch (error) {
      await t.rollback();
      throw boom.badRequest(error.message);
    }
  }

  async find() {
    try {
      const empleados = await models.Empleado.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        where: {
          estado: true,
        },
        include: [
          {
            model: models.EmpleadoAsignacion,
            as: 'empleado_asignacion',
            include: [
              { model: models.Rol, as: 'rol' },
              { model: models.Areas, as: 'area' },
            ],
          },
        ],
        order: [['id', 'ASC']],
      });

      if (empleados.length < 1) {
        throw boom.notFound('No hay empleados activos');
      }

      // Formatear los datos para incluir solo rol y área
      const empleadosFormateados = empleados.map((empleado) => {
        const empleadoData = empleado.toJSON();
        const asignacion = empleadoData.empleado_asignacion || [];
        delete empleadoData.empleado_asignacion;

      return {
        empleado: empleadoData,
        asignacion: asignacion.length > 0
          ? {
            id_area: asignacion[0].id_area,
            area: asignacion[0].area?.nombre,
            id_rol: asignacion[0].id_rol,
            rol: asignacion[0].rol?.nombre,
            horas_semanales: asignacion[0].horas_semanales,
            }
          : null,
      };
      });

      return {
        message: 'Empleados activos encontrados correctamente',
        empleados: empleadosFormateados,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async findOne(id) {
    try {
      const empleado = await models.Empleado.findByPk(id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
        include: [
          {
            model: models.EmpleadoAsignacion,
            as: 'empleado_asignacion',
            include: [
              { model: models.Rol, as: 'rol' },
              { model: models.Areas, as: 'area' },
            ],
          },
        ],
      });

      if (!empleado) {
        throw boom.notFound('Empleado no encontrado');
      }

      const empleadoData = empleado.toJSON();
      const asignacion = empleadoData.empleado_asignacion || [];
      delete empleadoData.empleado_asignacion;

      return {
        message: 'Empleado encontrado correctamente',
        empleado: empleadoData,
        asignacion: asignacion.length > 0
          ? {
            id_area: asignacion[0].id_area,
            area: asignacion[0].area?.nombre,
            id_rol: asignacion[0].id_rol,
            rol: asignacion[0].rol?.nombre,
            horas_semanales: asignacion[0].horas_semanales,
            }
          : null,
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async update(id, data) {
    const { empleado: empleadoData = {}, asignacion: asignacionData = {} } = data;

    const empleado = await models.Empleado.findByPk(id, {
      include: [
        {
          model: models.EmpleadoAsignacion,
          as: 'empleado_asignacion',
          include: [
            { model: models.Rol, as: 'rol' },
            { model: models.Areas, as: 'area' },
          ],
        },
      ],
    });

    if (!empleado) throw boom.notFound('Empleado no encontrado');

    await validarCamposUnicos(empleadoData, id);

    if (Object.keys(empleadoData).length > 0) {
      await empleado.update(empleadoData);
    }

    if (Object.keys(asignacionData).length > 0) {
      const asignacion = await models.EmpleadoAsignacion.findOne({
        where: { id_empleado: id },
      });

      if (asignacion) {
        await asignacion.update(asignacionData);
      } else {
        await models.EmpleadoAsignacion.create({
          id_empleado: id,
          ...asignacionData,
          estado: true,
        });
      }
    }

    return { message: 'Empleado actualizado correctamente' };
  }

  async findEmpleadosAnteriores() {
    const empleados = await models.Empleado.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
      where: { estado: false },
      include: [
        {
          model: models.EmpleadoAsignacion,
          as: 'empleado_asignacion',
          include: [
            { model: models.Rol, as: 'rol' },
            { model: models.Areas, as: 'area' },
          ],
        },
      ],
      order: [['id', 'ASC']],
    });

    // Formatear igual que en find()
    const empleadosFormateados = empleados.map((empleado) => {
      const empleadoData = empleado.toJSON();
      const asignacion = empleadoData.empleado_asignacion || [];
      delete empleadoData.empleado_asignacion;

      return {
        empleado: empleadoData,
        asignacion: asignacion.length > 0
          ? {
            id_area: asignacion[0].id_area,
            area: asignacion[0].area?.nombre,
            id_rol: asignacion[0].id_rol,
            rol: asignacion[0].rol?.nombre,
            horas_semanales: asignacion[0].horas_semanales,
            }
          : null,
      };
    });

    return {
      message: 'Empleados inactivos encontrados correctamente',
      empleados: empleadosFormateados,
    };
  }

  async delete(id) {
    try {
      const empleado = await models.Empleado.findByPk(id);
      if (!empleado) {
        throw boom.notFound('Empleado no encontrado');
      }
      if (!empleado.estado) {
        throw boom.conflict('El empleado ya está desactivado');
      }
      await empleado.update({ estado: false });
      //Desactivar asignaciones
      await models.EmpleadoAsignacion.update(
        { estado: false },
        { where: { id_empleado: id, estado: true } }
      );
      return {
        message: 'Empleado eliminado correctamente',
      }
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }
}

module.exports = EmpleadosService;
