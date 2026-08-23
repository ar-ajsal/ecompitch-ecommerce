const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
});

const specSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [{ type: String }],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    salePrice: {
      type: Number,
      default: null,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reorderLevel: {
      type: Number,
      default: 12,
    },
    status: {
      type: String,
      enum: ['Active', 'Draft', 'Archived'],
      default: 'Active',
    },
    images: [imageSchema],
    sold: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
    specifications: [specSchema],
    variants: [variantSchema],
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', brand: 'text', category: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

module.exports = mongoose.model('Product', productSchema);
