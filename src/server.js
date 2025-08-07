import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import sequelize from './config/database.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

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
