// src/routes/user/addressRoutes.js
import express from 'express';
import { authenticate } from '../../middleware/authenticate.js'; 
import {
  createAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress
} from '../../controllers/user/addressController.js';

const router = express.Router();

router.post('/address/add-address', authenticate, createAddress);

router.get('/', authenticate, getAllAddresses);

router.get('/address/address/:id', authenticate, getAllAddresses);

router.put('/address/update-address/:id', authenticate, updateAddress);

router.delete('/address/delete-address/:id', authenticate, deleteAddress);

export default router;


