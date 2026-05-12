// src/routes/reportes.js
const express = require("express");
const router = express.Router();
const {
  reporteStockActual,
  reporteMovimientos,
  reporteStockBajo,
  reporteDashboard,
} = require("../controllers/reportesController");
const { soloRoles } = require("../middlewares/roles.middleware");

// Dashboard accesible para ambos roles
router.get("/dashboard", soloRoles("admin", "empleado"), reporteDashboard);

// Estos solo para admin
router.get("/stock-actual", soloRoles("admin"), reporteStockActual);
router.get("/stock-bajo", soloRoles("admin"), reporteStockBajo);
router.get("/movimientos", soloRoles("admin"), reporteMovimientos);

module.exports = router;
