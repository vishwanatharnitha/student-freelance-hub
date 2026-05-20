import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Design', 'Coding', 'Writing', 'Editing', 'Tutoring', 'Other'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1, // Student-friendly small amount
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'paused'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Add indexing for category and seller
gigSchema.index({ category: 1 });
gigSchema.index({ seller: 1 });

const Gig = mongoose.model('Gig', gigSchema);
export default Gig;
