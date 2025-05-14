const express = require('express');
const ServiciosController = require('../../src/controllers/servicios.controller');
const serviciosController = new ServiciosController();

const router = express.Router();

//Obtener todos los servicios
router.get('/GET/servicios', (req, res, next) => {
  serviciosController.find(req, res, next);
});

//Obtener un servicio por id
router.get('/GET/servicios/:id', (req, res, next) => {
  serviciosController.findOne(req, res, next);
});

module.exports = router;
