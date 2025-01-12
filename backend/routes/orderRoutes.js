import express from 'express';
import { createOrder, getOrders, cancelOrder, updateAddress } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/',  authenticateToken,getOrders);
router.delete('/:id',authenticateToken, cancelOrder); // Cancel Order API
router.put('/:id/update-address', authenticateToken,updateAddress); // Update Address API

export default router;
