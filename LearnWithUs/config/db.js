const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = 'mongodb://127.0.0.1:27017/learnwithus';

  try {
    // Attempt 1: Connect to Atlas primary URI
    await mongoose.connect(primaryUri, {
      family: 4, // Force IPv4 DNS lookup to prevent ETIMEOUT on Windows
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected to Cloud Atlas...');
  } catch (err) {
    console.warn(`MongoDB Cloud Connection Warning (${err.message}). Trying fallback connection...`);
    try {
      // Attempt 2: Connect to local MongoDB fallback
      await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('MongoDB Connected to Local Database Fallback...');
    } catch (localErr) {
      console.error('MongoDB Fallback Connection Error:', localErr.message);
      console.warn('Backend server running in offline memory mode.');
    }
  }
};

module.exports = connectDB;
