const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'Máximo 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'Mínimo 6 caracteres'],
    select: false  // No se retorna por defecto en las consultas
  },
  phone: {
    type: String,
    trim: true
  },
  
  // ============ NUEVO: PERFIL DE NEURODIVERSIDAD ============
  neuroProfile: {
    // Tipo de neurodivergencia (opcional, el usuario decide)
    type: {
      type: String,
      enum: ['tea', 'tdah', 'hipersensibilidad', 'ninguna', 'prefiero-no-decir'],
      default: 'prefiero-no-decir'
    },
    
    // Preferencias sensoriales guardadas por defecto
    defaultPreferences: {
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
      preferPictogramMenu: {
        type: Boolean,
        default: false
      }
    },
    
    // Necesidades especiales declaradas
    specialNeeds: {
      hasSensorySensitivity: { type: Boolean, default: false },
      needsQuietSpace: { type: Boolean, default: false },
      needsVisualAids: { type: Boolean, default: false },
      otherNotes: String
    }
  },
  
  // Rol del usuario
  role: {
    type: String,
    enum: ['admin', 'barista', 'mesero', 'cliente'],
    default: 'cliente'
  },
  
  active: {
    type: Boolean,
    default: true
  },
  
  // Estadísticas de uso
  visitCount: {
    type: Number,
    default: 0
  },
  lastVisit: Date
}, {
  timestamps: true,
  versionKey: false
});

// ============ MIDDLEWARE ============

// Hashear password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ============ MÉTODOS ============

// Comparar password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ============ ÍNDICES ============
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, active: 1 });

module.exports = mongoose.model('User', userSchema);