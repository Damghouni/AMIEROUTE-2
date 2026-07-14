const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['client', 'merchant', 'driver', 'admin'],
    default: 'client'
  },
  avatar: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: { type: String, default: 'France' },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);