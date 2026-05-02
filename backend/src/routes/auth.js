const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../controllers/authController');

router.post('/registro', registrarUsuario);

module.exports = router;