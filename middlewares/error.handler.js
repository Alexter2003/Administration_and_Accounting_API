//middleware para manejar errores
function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

//middleware para manejar errores
function errorHandler(err, req, res) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

//middleware para manejar errores de boom
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

module.exports = { logErrors, errorHandler, boomErrorHandler };
