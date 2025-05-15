const boom = require('@hapi/boom');
const { models } = require('./../config/sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function generarPasswordAleatoria(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

async function validarCamposUnicos(data, excludeId = null) {
  if (data.dpi) {
    const existingDpi = await models.Empleado.findOne({ where: { dpi: data.dpi } });
    if (existingDpi && existingDpi.id !== excludeId) {
      throw boom.conflict('El DPI ya está registrado');
    }
  }

  if (data.telefono) {
    const existingTelefono = await models.Empleado.findOne({ where: { telefono: data.telefono } });
    if (existingTelefono && existingTelefono.id !== excludeId) {
      throw boom.conflict('El teléfono ya está registrado');
    }
  }

  if (data.email) {
    const normalizedEmail = data.email.trim().toLowerCase();
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
      // Validar campos únicos antes de crear el empleado
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

      // Crear la asignación
      const asignacion = await models.EmpleadoAsignacion.create({
        id_empleado: newEmpleado.id,
        id_rol: data.id_rol,
        id_area: data.id_area,
        horas_semanales: data.horas_semanales,
      });

      const asignacionCompleta = await models.EmpleadoAsignacion.findOne({
        where: { id: asignacion.id },
        include: [
          { model: models.Rol, as: 'rol' },
          { model: models.Areas, as: 'area' },
        ],
      });

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
          asignacion: asignacion.map(asignacion => ({
            id_area: asignacion.id_area,
            area: asignacion.area?.nombre || null,
            id_rol: asignacion.id_rol,
            horas_semanales: asignacion.horas_semanales,
          })),
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
        asignacion: asignacion.map(asignacion => ({
          id_area: asignacion.id_area,
          area: asignacion.area?.nombre || null,
          id_rol: asignacion.id_rol,
          horas_semanales: asignacion.horas_semanales,
        })),
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }

  async update(id, data) {
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

    if (!empleado) {
      throw boom.notFound('Empleado no encontrado');
    }

    await validarCamposUnicos(data, id);

    // Actualizar los datos del empleado
    const updatedEmpleado = await empleado.update(data);

    // Actualizar o crear la asignacion si se proporciona
    if (data.id_rol && data.id_area) {
      const asignacion = await models.EmpleadoAsignacion.findOne({
        where: { id_empleado: id, estado: true },
      });

      if (asignacion) {
        // Actualizar la asignacion existente
        await asignacion.update({
          id_rol: data.id_rol,
          id_area: data.id_area,
          horas_semanales: data.horas_semanales || asignacion.horas_semanales,
        });
      } else {
        // Crear una nueva asignacion
        await models.EmpleadoAsignacion.create({
          id_empleado: id,
          id_rol: data.id_rol,
          id_area: data.id_area,
          horas_semanales: data.horas_semanales,
          estado: true,
        });
      }
    }

    // Excluir datos sensibles de la respuesta
    const empleadoData = updatedEmpleado.toJSON();
    delete empleadoData.password;
    delete empleadoData.createdAt;
    delete empleadoData.updatedAt;

    const asignacion = await models.EmpleadoAsignacion.findAll({
      where: { id_empleado: id, estado: true },
      include: [
        { model: models.Rol, as: 'rol' },
        { model: models.Areas, as: 'area' },
      ],
    });

    return {
      message: 'Empleado actualizado correctamente'
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
        message: 'Empleado eliminado con éxito'
      };
    } catch (error) {
      if (boom.isBoom(error)) {
        throw error;
      }
      throw boom.internal(error);
    }
  }
}

module.exports = EmpleadosService;
