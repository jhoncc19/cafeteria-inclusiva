const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
  cancelReservation,
  submitFeedback
} = require('../controllers/reservationController');

// Rutas de usuario
router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.post('/:id/feedback', protect, submitFeedback);
router.delete('/:id', protect, cancelReservation);

// Rutas de admin
router.get('/', protect, authorize('admin'), getAllReservations);
router.put('/:id', protect, authorize('admin'), updateReservation);

module.exports = router;