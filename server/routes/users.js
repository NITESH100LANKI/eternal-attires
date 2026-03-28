const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  res.status(201).json({ message: 'User created', user: { id: user._id, name, email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: 'Invalid email or password' });

  res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = router;
