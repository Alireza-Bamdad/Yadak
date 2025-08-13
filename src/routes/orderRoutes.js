// src/routes/orders/orderRoutes.js
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import {
  createOrder,
  getOrders,
  getOrderDetails
} from '../../controllers/orders/orderController.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/:orderId', authenticate, getOrderDetails);

export default router;
