//authRoutes.js
import express from 'express';
import {
  login,
  forgotPassword,
  registerOtpCheck,
  registerOtpComplete,
  verifyOtp,
  updatePassword,
  registerOtpBegin,
  getProfile,
  updateProfile,
  logout,
} from '../controllers/authController.js';

import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

//OTP & Auth
router.post('/register-otp-begin', registerOtpBegin);
router.post('/register-otp-check', registerOtpCheck);
router.post('/register-otp-complete', registerOtpComplete);
router.post('/login', login);

//Password recovery
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/update-password', updatePassword);

// Profile access
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

export default router;
