const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountAmount: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  minPurchase: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
