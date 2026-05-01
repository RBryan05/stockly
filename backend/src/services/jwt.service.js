const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Genera un token JWT firmado con los datos del usuario.
 * @param {Object} payload - Datos a incluir en el token (ej: { id, email, role })
 * @returns {string} Token JWT firmado
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica y decodifica un token JWT.
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado si el token es válido
 * @throws {Error} Si el token es inválido o ha expirado
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };