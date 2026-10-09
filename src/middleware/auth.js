const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

/**
 * Middleware que verifica si el usuario está autenticado.
 * Lee el token del header Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Verificar header Authorization
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado: token requerido'
      });
    }
    
    // Verificar token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }
    
    // Buscar usuario (sin password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado o inactivo'
      });
    }
    
    // Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Error de autenticación'
    });
  }
};

/**
 * Middleware que verifica si el usuario tiene uno de los roles permitidos.
 * Uso: authorize('admin', 'barista')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `El rol '${req.user.role}' no tiene permiso para esta acción`
      });
    }
    
    next();
  };
};

module.exports = { protect, authorize };