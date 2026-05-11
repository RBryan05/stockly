// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  reactivarUsuario,
} = require("../controllers/usuariosController");
const { soloRoles } = require("../middlewares/roles.middleware");

// Solo admin 
router.get("/", soloRoles("admin"), getUsuarios);
router.get("/:id", soloRoles("admin"), getUsuarioById);
router.post("/", soloRoles("admin"), crearUsuario);
router.delete("/:id", soloRoles("admin"), desactivarUsuario);
router.patch("/:id/reactivar", soloRoles("admin"), reactivarUsuario);

// Admin y empleado (la lógica fina está en el controlador) 
router.put("/:id", soloRoles("admin", "empleado"), actualizarUsuario);

module.exports = router;