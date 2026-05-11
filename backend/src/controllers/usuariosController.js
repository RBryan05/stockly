// src/controllers/usuariosController.js
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

// GET /api/v1/usuarios
// Solo admin puede ver la lista de usuarios
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ ok: true, total: usuarios.length, data: usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// GET /api/v1/usuarios/:id
// Solo admin puede ver el detalle de cualquier usuario
const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-password");

    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    res.json({ ok: true, data: usuario });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// POST /api/v1/usuarios
// Solo admin puede crear usuarios (empleado o admin)
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "nombre, email y password son obligatorios",
      });
    }

    // Solo roles válidos
    const rolFinal = rol && ["admin", "empleado"].includes(rol) ? rol : "empleado";

    // Verificar email duplicado
    const existe = await Usuario.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({
        ok: false,
        mensaje: "El email ya está registrado en el sistema",
      });
    }

    // Validar fortaleza de contraseña
    if (password.length < 8) {
      return res.status(400).json({
        ok: false,
        mensaje: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password: passwordHash,
      rol: rolFinal,
    });

    await nuevoUsuario.save();

    res.status(201).json({
      ok: true,
      mensaje: `Usuario ${rolFinal} creado exitosamente`,
      data: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        activo: nuevoUsuario.activo,
        createdAt: nuevoUsuario.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// PUT /api/v1/usuarios/:id
// Reglas:
//   - Admin puede editar cualquier cuenta de empleado
//   - Admin solo puede editar su PROPIA cuenta si es admin
//   - Empleado solo puede editar su PROPIA cuenta
const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const solicitante = req.usuario; // viene del token
    const targetId = req.params.id;

    const usuario = await Usuario.findById(targetId);
    if (!usuario || !usuario.activo) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    // Lógica de permisos 
    const esPropietario = solicitante.id.toString() === targetId.toString();
    const solicitanteEsAdmin = solicitante.rol === "admin";
    const targetEsAdmin = usuario.rol === "admin";

    if (solicitanteEsAdmin) {
      // Un admin intenta editar una cuenta admin ajena → bloqueado
      if (targetEsAdmin && !esPropietario) {
        return res.status(403).json({
          ok: false,
          mensaje: "No puedes editar la cuenta de otro administrador",
        });
      }
      // Admin editando su propia cuenta o una cuenta de empleado → permitido
    } else {
      // Es empleado: solo puede editar su propia cuenta
      if (!esPropietario) {
        return res.status(403).json({
          ok: false,
          mensaje: "Solo puedes editar tu propia cuenta",
        });
      }
    }

    // Verificar email duplicado si se cambia
    if (email && email.toLowerCase() !== usuario.email) {
      const emailExiste = await Usuario.findOne({ email: email.toLowerCase() });
      if (emailExiste) {
        return res.status(400).json({
          ok: false,
          mensaje: "El email ya está en uso por otro usuario",
        });
      }
    }

    // Aplicar cambios
    if (nombre !== undefined) usuario.nombre = nombre.trim();
    if (email !== undefined) usuario.email = email.toLowerCase().trim();

    if (password !== undefined) {
      if (password.length < 8) {
        return res.status(400).json({
          ok: false,
          mensaje: "La contraseña debe tener al menos 8 caracteres",
        });
      }
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }

    // El rol NO se puede cambiar desde este endpoint
    // (para eso existiría un endpoint dedicado si se necesita en el futuro)
    await usuario.save();

    res.json({
      ok: true,
      mensaje: "Usuario actualizado exitosamente",
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
      },
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

// DELETE /api/v1/usuarios/:id  (soft delete)
// Solo admin puede desactivar usuarios
// No puede desactivar su propia cuenta
// No puede desactivar cuentas de otros admins
const desactivarUsuario = async (req, res) => {
  try {
    const solicitante = req.usuario;
    const targetId = req.params.id;

    const usuario = await Usuario.findById(targetId);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    // No puede desactivarse a sí mismo
    if (solicitante.id.toString() === targetId.toString()) {
      return res.status(400).json({
        ok: false,
        mensaje: "No puedes desactivar tu propia cuenta",
      });
    }

    // No puede desactivar otro admin
    if (usuario.rol === "admin") {
      return res.status(403).json({
        ok: false,
        mensaje: "No puedes desactivar la cuenta de otro administrador",
      });
    }

    usuario.activo = false;
    await usuario.save();

    res.json({ ok: true, mensaje: "Usuario desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};


// PATCH /api/v1/usuarios/:id/reactivar
// Solo admin puede reactivar usuarios

const reactivarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado" });
    }

    if (usuario.activo) {
      return res.status(400).json({ ok: false, mensaje: "El usuario ya está activo" });
    }

    usuario.activo = true;
    await usuario.save();

    res.json({ ok: true, mensaje: "Usuario reactivado correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  reactivarUsuario,
};