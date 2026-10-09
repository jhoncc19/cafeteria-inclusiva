const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userSnapshot: {
    name: String,
    email: String
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productSnapshot: {
      name: String,
      category: String,
      image: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  notes: String,

  sensoryContext: {
    noiseLevelAtOrder: String,   
    specialRequest: String,      
    pictogramMode: {             
      type: Boolean,
      default: false
    }
  },
  
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);