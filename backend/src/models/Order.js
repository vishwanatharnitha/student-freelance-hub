import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    price: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Add indexing for buyer, seller, and status
orderSchema.index({ buyer: 1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
