const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generateToken } = require("../services/jwt.service");

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // 1. Validar que vengan todos los datos
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son obligatorios" });
    }

    // 2. Verificar si el correo ya está registrado (Estilo MongoDB)
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ mensaje: "El email ya está registrado en el sistema" });
    }

    // 3. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Crear el nuevo usuario y guardarlo en la base de datos
    const nuevoUsuario = new Usuario({
      nombre: nombre,
      email: email,
      password: passwordHash,
    });

    await nuevoUsuario.save(); // ¡Así se guarda en MongoDB!

    // 5. Enviar respuesta de éxito
    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      mensaje: "Hubo un error en el servidor al registrar el usuario",
    });
  }
};

// ENDPOINTS LOGIN -------------------------------------------
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, mensaje: "Email y contraseña son obligatorios" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res
        .status(401)
        .json({ ok: false, mensaje: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res
        .status(401)
        .json({ ok: false, mensaje: "Credenciales inválidas" });
    }

    const token = generateToken({
      id: usuario._id,
      email: usuario.email,
      nombre: usuario.nombre,
    });

    res.status(200).json({
      ok: true,
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error al hacer login:", error);
    res
      .status(500)
      .json({ ok: false, mensaje: "Error en el servidor al iniciar sesión" });
  }
};
module.exports = {
  registrarUsuario,
  loginUsuario,
};
