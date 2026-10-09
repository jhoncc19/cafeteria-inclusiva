const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'Máximo 100 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['calientes', 'frias', 'dulces', 'salados'],
      message: 'Categoría no válida'
    }
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  description: {
    type: String,
    maxlength: [500, 'Máximo 500 caracteres']
  },
  image: String,
  available: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
    // ============ NUEVO: Soporte para pictogramas ============
  pictogramUrl: {
    type: String,
    default: null  // URL del pictograma (imagen accesible)
  },
  
  // Nivel de complejidad sensorial del producto
  // (útil para personas con hipersensibilidad)
  sensoryLevel: {
    type: String,
    enum: ['bajo', 'medio', 'alto'],
    default: 'bajo'
  },
  
  // Alérgenos
  allergens: [{
    type: String,
    enum: ['gluten', 'lactosa', 'frutos-secos', 'huevo', 'soya', 'mariscos', 'ninguno']
  }],
  
  // Textura/consistencia (útil para TEA)
  texture: {
    type: String,
    enum: ['liquido', 'cremoso', 'solido', 'crujiente', 'suave', 'ninguna'],
    default: 'ninguna'
  },
  
  // Temperatura
  temperature: {
    type: String,
    enum: ['caliente', 'tibio', 'frio', 'ambiente', 'ninguna'],
    default: 'ninguna'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 } }
);
productSchema.index(
  { available: 1, category: 1 },
  { partialFilterExpression: { available: true } }
);

module.exports = mongoose.model('Product', productSchema);