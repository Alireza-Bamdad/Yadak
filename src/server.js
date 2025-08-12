import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import sequelize from './config/database.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js'
 

dotenv.config();

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', productRoutes);


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
