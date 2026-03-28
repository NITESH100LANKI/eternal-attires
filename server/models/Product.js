const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    }
  ],
  category: { type: String, required: true },
  brand: { type: String },
  sizes: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  numOfReviews: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviews: [reviewSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Admin who added
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
