
import express from 'express';
import { checkRole } from '../middleware/checkRole.js';
import { createUser, deleteUser, updateUser } from '../controllers/adminController.js';
import { createCategory } from '../controllers/categoryController.js';
import { authenticate } from '../middleware/authenticate.js';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();


router.post('/create-user', checkRole('super_admin'), createUser);
router.put('/update-user/:id',checkRole('super_admin'), updateUser);
router.delete('/delete-user/:id', checkRole('super_admin'), deleteUser);

router.post('/create-category',authenticate, createCategory);


router.post('/create-product',upload.single('image'),authenticate, createProduct);
router.put('/update-product/:id',upload.single('image'), authenticate, updateProduct);
router.delete('/delete-product/:id',authenticate, deleteProduct);



export default router;

