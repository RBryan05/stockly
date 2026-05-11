// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        mensaje: "Acceso denegado. Token requerido",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded; // { id, email, nombre, rol }
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: "Token inválido o expirado",
    });
  }
};

module.exports = { verificarToken };