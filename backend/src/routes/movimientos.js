// src/routes/movimientos.js
const express = require('express');
const router = express.Router();
const {
  getMovimientos,
  getMovimientoById,
  crearMovimiento,
} = require('../controllers/movimientosController');

router.get('/', getMovimientos);
router.get('/:id', getMovimientoById);
router.post('/', crearMovimiento);  // No hay PUT/DELETE: el historial es inmutable

module.exports = router;