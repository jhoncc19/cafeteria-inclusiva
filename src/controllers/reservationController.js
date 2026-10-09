const Reservation = require('../models/Reservation');
const User = require('../models/User');

/**
 * Crear una nueva reserva.
 * POST /api/reservations
 */
const createReservation = async (req, res) => {
  try {
    const { date, timeSlot, partySize, sensoryPreferences, specialNeeds } = req.body;
    
    // Verificar disponibilidad (no más de X reservas por slot)
    const existingReservations = await Reservation.countDocuments({
      date: new Date(date),
      timeSlot,
      status: { $in: ['pendiente', 'confirmada'] }
    });
    
    if (existingReservations >= 5) {
      return res.status(400).json({
        success: false,
        error: 'No hay disponibilidad en ese horario'
      });
    }
    
    // Crear reserva
    const reservation = await Reservation.create({
      userId: req.user._id,
      userSnapshot: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      date: new Date(date),
      timeSlot,
      partySize,
      sensoryPreferences: sensoryPreferences || {},
      specialNeeds: specialNeeds || {}
    });
    
    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener reservas del usuario autenticado.
 * GET /api/reservations/my
 */
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id })
      .sort('-date')
      .lean();
    
    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Obtener TODAS las reservas (solo admin).
 * GET /api/reservations
 */
const getAllReservations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, date } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = new Date(date);
    
    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Reservation.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data: reservations,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Actualizar estado de reserva (solo admin).
 * PUT /api/reservations/:id
 */
const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Cancelar reserva.
 * DELETE /api/reservations/:id
 */
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada'
      });
    }
    
    // Solo el dueño o admin puede cancelar
    if (reservation.userId.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para cancelar esta reserva'
      });
    }
    
    reservation.status = 'cancelada';
    await reservation.save();
    
    res.json({
      success: true,
      message: 'Reserva cancelada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Enviar feedback post-visita.
 * POST /api/reservations/:id/feedback
 */
const submitFeedback = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        feedback: {
          ...req.body,
          submittedAt: new Date()
        }
      },
      { new: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservation,
  cancelReservation,
  submitFeedback
};