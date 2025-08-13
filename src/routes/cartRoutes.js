// src/routes/cart/cartRoutes.js
import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart
} from '../controllers/cart/cartController.js';

const router = express.Router();

router.post('/add', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.delete('/remove/:productId', authenticate, removeFromCart);
router.put('/update/:productId', authenticate, updateCart);

export default router;
