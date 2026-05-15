const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'India' }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
