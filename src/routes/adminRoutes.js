import express from 'express';
import { checkRole } from '../middleware/checkRole.js';
import { createUser, deleteUser, updateUser } from '../controllers/adminController.js';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { createCategory } from '../controllers/categoryController.js';
const router = express.Router();


router.post('/create-user', checkRole('super_admin'), createUser);
router.delete('/delete-user/:id', checkRole('super_admin'), deleteUser);


router.post('/create-product', checkRole('product_admin'), createProduct);
router.put('/update-product/:id', checkRole('product_admin'), updateProduct);
router.delete('/delete-product/:id', checkRole('product_admin'), deleteProduct);
router.post('/create-category', checkRole('product_admin'), createCategory);

export default router;
