const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { validationResult } = require('express-validator');

/**
 * Registro de usuario.
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    // Verificar validaciones
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { name, email, password, phone, neuroProfile } = req.body;
    
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }
    
    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      phone,
      neuroProfile: neuroProfile || {}
    });
    
    // Generar token
    const token = generateToken(user._id, user.role);
    
    // Responder (sin password)
    user.password = undefined;
    
    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Login de usuario.
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { email, password } = req.body;
    
    // Buscar usuario (incluyendo password)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    if (!user.active) {
      return res.status(401).json({
        success: false,
        error: 'Usuario inactivo. Contacta al administrador.'
      });
    }
    
    // Verificar password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    // Generar token
    const token = generateToken(user._id, user.role);
    
    // Actualizar última visita
    user.lastVisit = new Date();
    user.visitCount += 1;
    await user.save({ validateBeforeSave: false });
    
    // Responder
    user.password = undefined;
    
    res.json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado.
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar preferencias sensoriales del usuario.
 * PUT /api/auth/preferences
 */
const updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'neuroProfile.defaultPreferences': req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { register, login, getMe, updatePreferences };