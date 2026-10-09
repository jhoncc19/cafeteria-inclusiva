const jwt = require('jsonwebtoken');

/**
 * Genera un token JWT para un usuario.
 * @param {string} userId - ID del usuario
 * @param {string} role - Rol del usuario
 * @returns {string} Token JWT firmado
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verifica si un token es válido.
 * @param {string} token - Token a verificar
 * @returns {object|null} Payload decodificado o null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };