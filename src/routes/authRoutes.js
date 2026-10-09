const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updatePreferences
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validaciones
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Password requerido')
];

// Rutas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);

module.exports = router;