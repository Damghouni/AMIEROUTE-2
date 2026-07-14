const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  options: [{
    name: String,
    choice: String,
    priceModifier: Number
  }]
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'France' },
    coordinates: {
      lat: Number,
      lng: Number
    },
    instructions: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  tip: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'wallet'],
    default: 'card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String,
  rating: {
    store: { type: Number, min: 1, max: 5 },
    driver: { type: Number, min: 1, max: 5 },
    comment: String
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

orderSchema.index({ client: 1, createdAt: -1 });
orderSchema.index({ store: 1, status: 1 });
orderSchema.index({ driver: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
