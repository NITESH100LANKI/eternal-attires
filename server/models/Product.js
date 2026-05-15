const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  images: [{ type: String, required: true }],
  brand: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  sizes: [{ type: String }],
  reviews: [reviewSchema],
  averageRating: { type: Number, required: true, default: 0 },
  numOfReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// Backward compatibility for 'image' field
ProductSchema.virtual('image').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : '';
});

module.exports = mongoose.model('Product', ProductSchema);
