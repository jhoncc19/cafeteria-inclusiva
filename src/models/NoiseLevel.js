const mongoose = require('mongoose');

const noiseLevelSchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    default: 'principal'
  },
  
  // Timestamp con TTL (auto-eliminar después de 24 horas)
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 86400  // 24 horas en segundos
  },
  
  // Nivel de ruido en decibeles
  decibels: {
    type: Number,
    required: true,
    min: 0,
    max: 120
  },
  
  // Categoría para mostrar al usuario
  category: {
    type: String,
    enum: ['silencioso', 'moderado', 'concurrido', 'ruidoso'],
    required: true
  },
  
  // Ocupación del local (porcentaje)
  occupancy: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Patrón de día/hora (para estadísticas)
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6
  },
  hourOfDay: {
    type: Number,
    min: 0,
    max: 23
  }
});

// Índices para consultas
noiseLevelSchema.index({ locationId: 1, timestamp: -1 });
noiseLevelSchema.index({ dayOfWeek: 1, hourOfDay: 1 });

module.exports = mongoose.model('NoiseLevel', noiseLevelSchema);