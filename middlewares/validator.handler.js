const boom = require('@hapi/boom');

function validatorHandler(schema, property) {
  return (req, res, next) => {
    console.log('🕵️‍♂️ Validando esquema:', { schema, property }); // 👈 DEBUG
    if (!schema || typeof schema.validate !== 'function') {
      return next(boom.badImplementation('Schema inválido o no definido'));
    }


    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      return next(boom.badRequest(error));
    }

    next();
  };
}

module.exports = validatorHandler;
