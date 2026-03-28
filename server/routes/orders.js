const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

router.get('/', async (req, res) => {
  const orders = await Order.find().limit(100);
  res.json(orders);
});

router.post('/', async (req, res) => {
  const { userId, items, total } = req.body;
  if (!userId || !items || !total) return res.status(400).json({ message: 'userId/items/total required' });
  const order = await Order.create({ userId, items, total });
  res.status(201).json(order);
});

module.exports = router;
