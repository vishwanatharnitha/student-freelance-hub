import connectDB from './src/config/db.js';
import Gig from './src/models/Gig.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await connectDB();
  console.log('Connected to MongoDB');
  
  await Gig.deleteMany({});
  console.log('Deleted ALL gigs from database for a clean slate.');
  
  mongoose.disconnect();
};

run().catch(console.error);
