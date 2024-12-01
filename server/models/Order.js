const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtPurchase: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
        enum: ['ETH', 'USDT', 'USDC'],
      },
    },
  }],
  totalAmount: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ['ETH', 'USDT', 'USDC'],
    },
  },
  shippingAddress: {
    fullName: String,
    streetAddress: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String,
  },
  shippingMethod: {
    name: String,
    price: Number,
    currency: {
      type: String,
      enum: ['ETH', 'USDT', 'USDC'],
    },
    estimatedDays: Number,
  },
  status: {
    type: String,
    enum: [
      'pending_payment',
      'payment_received',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'disputed'
    ],
    default: 'pending_payment',
  },
  paymentDetails: {
    transactionHash: {
      type: String,
      required: true,
    },
    blockNumber: Number,
    paymentMethod: {
      type: String,
      enum: ['ETH', 'USDT', 'USDC'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentTimestamp: Date,
  },
  trackingInfo: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
  },
  deliveryStatus: {
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  disputeDetails: {
    hasDispute: {
      type: Boolean,
      default: false,
    },
    disputeReason: String,
    disputeStatus: {
      type: String,
      enum: ['open', 'resolved', 'closed'],
    },
    disputeTimestamp: Date,
    resolution: String,
    resolutionTimestamp: Date,
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('products') || this.isModified('shippingMethod')) {
    let total = 0;
    this.products.forEach(item => {
      total += item.priceAtPurchase.amount * item.quantity;
    });
    
    if (this.shippingMethod && this.shippingMethod.price) {
      total += this.shippingMethod.price;
    }
    
    this.totalAmount.amount = total;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
