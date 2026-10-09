const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  // Usuario que hace la reserva
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userSnapshot: {
    name: String,
    email: String,
    phone: String
  },
  
  // ============ PREFERENCIAS SENSORIALES ============
  sensoryPreferences: {
    noiseLevel: {
      type: String,
      enum: ['silencioso', 'moderado', 'ambiente'],
      default: 'moderado'
    },
    lighting: {
      type: String,
      enum: ['luz-natural', 'luz-baja', 'sin-luz-directa'],
      default: 'luz-natural'
    },
    seating: {
      type: String,
      enum: ['rincon-privado', 'mesa-ventana', 'zona-abierta', 'zona-tranquila'],
      default: 'zona-tranquila'
    },
    musicVolume: {
      type: String,
      enum: ['sin-musica', 'musica-suave', 'musica-ambiente'],
      default: 'musica-suave'
    },
    avoidCrowds: {
      type: Boolean,
      default: true
    }
  },
  
  // ============ DETALLES DE LA RESERVA ============
  date: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  timeSlot: {
    type: String,
    required: [true, 'El horario es obligatorio']
    // Ej: "14:00-15:30"
  },
  partySize: {
    type: Number,
    required: [true, 'El número de personas es obligatorio'],
    min: [1, 'Mínimo 1 persona'],
    max: [8, 'Máximo 8 personas']
  },
  
  // ============ NECESIDADES ESPECIALES ============
  specialNeeds: {
    hasSensorySensitivity: { type: Boolean, default: false },
    needsPictogramMenu: { type: Boolean, default: false },
    needsQuietSpace: { type: Boolean, default: false },
    notes: String
  },
  
  // ============ ESTADO ============
  status: {
    type: String,
    enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  
  // ============ FEEDBACK POST-VISITA ============
  feedback: {
    comfortLevel: { type: Number, min: 1, max: 5 },
    wouldReturn: Boolean,
    comments: String,
    submittedAt: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices
reservationSchema.index({ userId: 1, date: -1 });
reservationSchema.index({ date: 1, status: 1 });
reservationSchema.index({ 'sensoryPreferences.noiseLevel': 1 });

module.exports = mongoose.model('Reservation', reservationSchema);