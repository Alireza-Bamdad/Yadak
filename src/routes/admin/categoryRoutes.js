//routes/admin/categoryRoutes

import express from 'express';
import  {checkRole} from '../../middleware/checkRole.js';  
import { createCategory, updateCategory, deleteCategory, getAllCategories } from '../../controllers/admin/categoryController.js';  // کنترلر مدیریت دسته‌بندی‌ها
import  {authenticate}  from '../../middleware/authenticate.js';

const router = express.Router();

router.post('/create-category',authenticate, checkRole('admin'), createCategory); 
router.put('/update-category/:id',authenticate, checkRole('admin'), updateCategory);  
router.delete('/delete-category/:id',authenticate, checkRole('admin'), deleteCategory);  
router.get('/all-categories',authenticate, checkRole('admin'), getAllCategories);  

export default router;

