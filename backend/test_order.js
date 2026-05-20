import connectDB from './src/config/db.js';
import Gig from './src/models/Gig.js';
import User from './src/models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await connectDB();
  console.log('Connected to MongoDB');

  const gig = await Gig.findOne();
  if (!gig) {
    console.log('No gig found to test');
    return mongoose.disconnect();
  }

  console.log('Found Gig:', gig._id);

  // Simulate order creation logic
  const gigId = gig._id.toString();

  const foundGig = await Gig.findById(gigId);
  if (!foundGig) {
    console.log('Gig not found by ID:', gigId);
  } else {
    console.log('Gig FOUND by ID successfully!');
  }

  mongoose.disconnect();
};

run().catch(console.error);
