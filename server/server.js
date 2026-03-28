const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_URL
].filter(Boolean); // removes undefined

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/eternal-attires')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});