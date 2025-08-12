// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];  


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;  
    next();  
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
