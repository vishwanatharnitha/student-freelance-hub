import Order from '../models/Order.js';
import Gig from '../models/Gig.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    console.log('--- Incoming Order Request ---');
    console.log('Body:', req.body);
    console.log('User:', req.user._id);

    const { gigId, notes } = req.body;

    if (!gigId) {
      return res.status(400).json({ message: 'Missing gigId in request body' });
    }

    const gig = await Gig.findById(gigId);
    console.log('Gig Found?', gig ? 'Yes' : 'No');

    if (!gig) {
      return res.status(404).json({ message: `Gig not found in database for ID: ${gigId}` });
    }

    // Prevent ordering own gig
    if (gig.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot order your own gig' });
    }

    const order = new Order({
      gig: gig._id,
      buyer: req.user._id,
      seller: gig.seller,
      price: gig.price,
      notes: notes || ''
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// @desc    Get user's orders (buyer or seller)
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    // Find orders where user is either buyer or seller
    const orders = await Order.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }]
    })
      .populate('gig', 'title category')
      .populate('buyer', 'name avatar email')
      .populate('seller', 'name avatar email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure only seller can accept/reject/complete, buyer could potentially cancel if pending (keeping it simple: only seller updates status)
    if (order.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this order' });
    }

    const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
