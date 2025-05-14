const express = require('express');
const EstadoDetalleController = require('../../src/controllers/estados_detalle.controller');
const estadosDetalleController = new EstadoDetalleController();

const router = express.Router();


//Obtener todos los estados detalle
router.get('/GET/estados_ordenes_detalles', (req, res, next) => {
  estadosDetalleController.find(req, res, next);
});

module.exports = router;
