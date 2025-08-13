import express from 'express';
import { getAllProducts } from '../controllers/admin/productController';

const router = express.Router();

router.get('/', getAllProducts);

export default router;
