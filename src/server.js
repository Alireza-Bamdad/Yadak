import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/database.js';

import authRoutes from './routes/authRoutes.js';
import adminUserRoutes from './routes/admin/userRoutes.js';
import adminCategoryRoutes from './routes/admin/categoryRoutes.js';
import adminProductRoutes from './routes/admin/productRoutes.js';
import userAddressRoutes from './routes/User/addressRoutes.js';
import publicProductsRoutes from './routes/productRoutes.js'
dotenv.config();

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));


app.use(express.json());
 
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/products', adminProductRoutes);

app.use('/api/user/addresses', userAddressRoutes)
app.use('/api/auth', authRoutes);


//get products

app.use('/api',publicProductsRoutes)

sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
