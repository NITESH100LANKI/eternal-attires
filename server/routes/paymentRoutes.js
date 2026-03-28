const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

// @desc    Create a Razorpay order
// @route   POST /api/payment/razorpay/order
// @access  Private
router.post('/razorpay/order', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error generating razorpay order." });
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/razorpay/verify
// @access  Private
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
       res.status(200).json({ message: "Payment verified successfully" });
    } else {
       res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error verifying payment." });
  }
});

// @desc    Fetch Razorpay Key for Frontend
// @route   GET /api/payment/razorpay/key
// @access  Private
router.get('/razorpay/key', protect, (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
