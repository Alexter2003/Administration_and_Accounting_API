const express = require('express');
const AutenticacionController = require('../../src/controllers/autenticacion.controller');
const autenticacionController = new AutenticacionController();

const router = express.Router();

// Login
router.post('/post/login', (req, res, next) => autenticacionController.login(req, res, next));

// Cambiar contrasenia
router.post('/post/cambiar-password', (req, res, next) => autenticacionController.cambiarPassword(req, res, next));

// Restablecer contrasenia
router.post('/post/restablecer-password', (req, res, next) => autenticacionController.restablecerPassword(req, res, next));

module.exports = router;
