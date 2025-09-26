import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    category: { 
      type: String, 
      required: true,
      enum: ['T-Shirt', 'Hoodie', 'Jacket', 'Jeans', 'Dress', 'Skirt', 'Shoes', 'Accessory']
    },
    gender: { 
      type: String, 
      required: true,
      enum: ['Men', 'Women', 'Unisex']
    },
    season: { 
      type: String, 
      required: true,
      enum: ['Spring', 'Summer', 'Autumn', 'Winter']
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
