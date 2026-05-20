import express from 'express';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.patch('/:id/status', protect, updateOrderStatus);

export default router;
