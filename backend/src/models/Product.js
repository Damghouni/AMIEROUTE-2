const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  options: [{
    name: String,
    choices: [{
      name: String,
      priceModifier: { type: Number, default: 0 }
    }]
  }],
  nutritionalInfo: {
    calories: Number,
    allergens: [String]
  }
}, {
  timestamps: true
});

productSchema.index({ store: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
