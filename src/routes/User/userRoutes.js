import express from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../../controllers/users/userController.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
