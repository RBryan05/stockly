// src/routes/reportes.js
const express = require('express');
const router = express.Router();
const {
  reporteStockActual,
  reporteMovimientos,
  reporteStockBajo,
  reporteDashboard,
} = require('../controllers/reportesController');

// Todos los reportes requieren token (se aplica en index.js)
// Solo admin puede ver reportes
const { soloRoles } = require('../middlewares/roles.middleware');

router.get('/dashboard',     soloRoles('admin'), reporteDashboard);
router.get('/stock-actual',  soloRoles('admin'), reporteStockActual);
router.get('/stock-bajo',    soloRoles('admin'), reporteStockBajo);
router.get('/movimientos',   soloRoles('admin'), reporteMovimientos);

module.exports = router;