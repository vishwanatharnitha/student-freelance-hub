import connectDB from './src/config/db.js';
import Gig from './src/models/Gig.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  await connectDB();
  console.log('Connected to MongoDB');

  // Find broken gigs (no seller or no title or invalid seller reference)
  // We can just fetch all gigs and check them manually
  const allGigs = await Gig.find();
  console.log(`Found ${allGigs.length} total gigs`);

  let deletedCount = 0;
  for (const gig of allGigs) {
    let isBroken = false;

    // Check if seller exists
    if (!gig.seller) {
      isBroken = true;
    }

    if (isBroken) {
      await Gig.findByIdAndDelete(gig._id);
      console.log(`Deleted broken gig: ${gig._id}`);
      deletedCount++;
    }
  }

  console.log(`Cleanup complete. Deleted ${deletedCount} broken gigs.`);
  mongoose.disconnect();
};

run().catch(console.error);
