const express = require('express');
const EstadoOrdenController = require('../../src/controllers/estados_orden.controller');
const estadosOrdenController = new EstadoOrdenController();

const router = express.Router();

//Obtener todos los estados orden
router.get('/GET/ordenes/estados_ordenes', (req, res, next) => {
  estadosOrdenController.find(req, res, next);
});

module.exports = router;
