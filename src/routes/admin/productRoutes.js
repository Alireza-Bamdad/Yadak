//routes/admin/productsRoutes

import express from 'express';
import {checkRole}  from '../../middleware/checkRole.js';  
import { createProduct, updateProduct, deleteProduct, getAllProducts } from '../../controllers/admin/productController.js';  
import  {authenticate} from '../../middleware/authenticate.js';


const router = express.Router();

router.post('/create-product', authenticate ,checkRole('admin'), createProduct);  
router.put('/update-product/:id', authenticate, checkRole('admin'), updateProduct); 
router.delete('/delete-product/:id', authenticate, checkRole('admin'), deleteProduct); 
router.get('/all-products', authenticate, checkRole('admin'), getAllProducts);  

export default router;
