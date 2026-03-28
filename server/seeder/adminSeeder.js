const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/User');

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/eternal-attires';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'admin@eternalattires.com';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. Exiting...');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();

    console.log('🎉 Admin user successfully created!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: admin123 (Please change after login)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
