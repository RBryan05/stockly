const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middlewares/auth.middleware");

// 🔐 Ruta protegida
router.get("/perfil", verificarToken, (req, res) => {
  res.json({
    ok: true,
    mensaje: "Acceso permitido",
    usuario: req.usuario,
  });
});

module.exports = router;