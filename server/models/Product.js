const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: ['ETH', 'USDT', 'USDC'],
      default: 'ETH',
    },
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Digital Art', 'Electronics', 'Collectibles', 'Gaming', 'Services', 'Other'],
  },
  type: {
    type: String,
    required: true,
    enum: ['digital', 'physical'],
  },
  images: [{
    url: String,
    isPrimary: Boolean,
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold_out'],
    default: 'active',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  specifications: [{
    name: String,
    value: String,
  }],
  shipping: {
    weight: Number, // in kg
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    methods: [{
      name: String,
      price: Number,
      currency: {
        type: String,
        enum: ['ETH', 'USDT', 'USDC'],
        default: 'ETH',
      },
      estimatedDays: Number,
    }],
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  contractAddress: {
    type: String,
    trim: true,
  },
  tokenId: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add text index for search functionality
productSchema.index({
  title: 'text',
  description: 'text',
  'tags': 'text',
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
