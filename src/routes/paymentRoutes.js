// src/routes/payments/paymentRoutes.js
import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  createPayment,
  getPaymentStatus
} from '../../controllers/payments/paymentController.js';

const router = express.Router();

router.post('/', authenticate, createPayment);
router.get('/:paymentId', authenticate, getPaymentStatus);

export default router;
