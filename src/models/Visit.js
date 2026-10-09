const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  },
  
  // Detalles de la visita
  date: {
    type: Date,
    default: Date.now
  },
  duration: Number,  // Duración en minutos
  
  // Sensaciones durante la visita
  sensoryExperience: {
    noiseComfort: { type: Number, min: 1, max: 5 },
    lightingComfort: { type: Number, min: 1, max: 5 },
    overallComfort: { type: Number, min: 1, max: 5 }
  },
  
  // ¿Volvería?
  wouldReturn: Boolean,
  
  notes: String
}, {
  timestamps: true,
  versionKey: false
});

visitSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Visit', visitSchema);