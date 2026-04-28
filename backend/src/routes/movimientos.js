const express = require('express');
const router = express.Router();
const { getMovimientos, getMovimientoById } = require('../controllers/movimientosController');

router.get('/', getMovimientos);
router.get('/:id', getMovimientoById);

module.exports = router;