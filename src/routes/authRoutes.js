//src/routes/authRoutes

import express from 'express';
import { 
    login, 
    forgotPassword,
    registerOtpCheck,
    registerOtpComplete, 
    verifyOtp, 
    updatePassword ,
    registerOtpBegin
    } from '../controllers/authController.js';


const router = express.Router();


router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.post('/verify-otp', verifyOtp);

router.post('/register-otp-begin', registerOtpBegin);  
router.post('/register-otp-check', registerOtpCheck);    
router.post('/register-otp-complete', registerOtpComplete); 

router.post('/update-password', updatePassword);



export default router;

