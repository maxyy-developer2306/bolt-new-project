import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  if (!config.mongoUrl) {
    console.error('MONGODB_URL is not set. Please configure it in your environment variables.');
    console.error('The server will start but database operations will fail.');
    return;
  }

  try {
    await mongoose.connect(config.mongoUrl);
    console.log('MongoDB Atlas connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Please check your MONGODB_URL environment variable.');
    console.error('Make sure your IP is allowlisted in MongoDB Atlas.');
  }
}
