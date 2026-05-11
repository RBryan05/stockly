// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generateToken } = require("../services/jwt.service");

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() });
    if (usuarioExistente) {
      return res.status(400).json({
        ok: false,
        mensaje: "El email ya está registrado en el sistema",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password: passwordHash,
      rol: 'empleado', // El registro público siempre crea empleados
    });

    await nuevoUsuario.save();

    res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor al registrar el usuario",
    });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Email y contraseña son obligatorios",
      });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: "Credenciales inválidas" });
    }

    // Verificar que la cuenta esté activa
    if (!usuario.activo) {
      return res.status(403).json({
        ok: false,
        mensaje: "Cuenta desactivada. Contacte al administrador",
      });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ ok: false, mensaje: "Credenciales inválidas" });
    }

    // ✅ El token ahora incluye el rol
    const token = generateToken({
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });

    res.status(200).json({
      ok: true,
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al hacer login:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor al iniciar sesión",
    });
  }
};

module.exports = { registrarUsuario, loginUsuario };