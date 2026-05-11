// src/middlewares/roles.middleware.js

/**
 * Middleware que verifica si el usuario autenticado tiene uno de los roles permitidos.
 * Siempre debe usarse DESPUÉS de verificarToken.
 *
 * Uso: soloRoles('admin')
 *      soloRoles('admin', 'empleado')
 */
const soloRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: "No autenticado",
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(" o ")}`,
      });
    }

    next();
  };
};

module.exports = { soloRoles };