import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Mỗi user chỉ có 1 cart
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount must be positive']
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  next();
});

// Method to add item to cart
CartSchema.methods.addItem = function(productId, price, quantity = 1) {
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, price, quantity });
  }
};

// Method to update item quantity
CartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(
    i => i.product.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(
        i => i.product.toString() !== productId.toString()
      );
    } else {
      item.quantity = quantity;
    }
  }
};

// Method to remove item
CartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
};

// Method to clear cart
CartSchema.methods.clearCart = function() {
  this.items = [];
  this.totalAmount = 0;
};

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);