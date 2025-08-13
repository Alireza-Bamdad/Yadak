//routes/admin/userRoutes

import express from 'express';
import  {checkRole}  from '../../middleware/checkRole.js';  
import { createUser, updateUser, deleteUser, getAllUsers } from '../../controllers/admin/userController.js'; 
import  {authenticate}  from '../../middleware/authenticate.js';

const router = express.Router();

router.post('/create-user',authenticate, checkRole('super_admin'), createUser);  
router.put('/update-user/:id', authenticate,checkRole('super_admin'), updateUser);  
router.delete('/delete-user/:id',authenticate, checkRole('super_admin'), deleteUser);  
router.get('/all-users',authenticate, checkRole('admin'), getAllUsers);  

export default router;

