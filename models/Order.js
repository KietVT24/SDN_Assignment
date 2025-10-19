import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String
  }
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount must be positive']
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'paypal', 'stripe'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    postalCode: String
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

// Virtual for order number
OrderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtuals are included in JSON
OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

// import mongoose from 'mongoose';

// const OrderItemSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true, min: 1 }
// }, { _id: false });

// const OrderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: { type: [OrderItemSchema], required: true },
//   totalAmount: { type: Number, required: true },
//   status: { type: String, enum: ['pending','paid','cancelled'], default: 'pending' }
// }, { timestamps: true });

// export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
