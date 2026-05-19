import mongoose from 'mongoose';

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    console.log('Using existing MongoDB connection');
    return cachedDb;
  }
  
  if (mongoose.connection.readyState >= 1) {
    cachedDb = mongoose.connection;
    return cachedDb;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/freelance-hub', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    cachedDb = conn.connection;
    return cachedDb;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
