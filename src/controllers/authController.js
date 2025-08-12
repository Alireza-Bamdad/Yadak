//src/controllers/authControllers.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendOtpSms } from '../utils/sms.js'; 
import { generateOTP } from '../utils/otpservice.js' 
import OtpCode from '../models/OtpCode.js'; 
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET;


export const registerOtpBegin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'phone is required' });

    const exists = await User.findOne({ where: { phone } });
    if (exists) {
      return res.json({ exists: true, message: 'User exists. Go to login' });
    }

    const otp = await generateOTP(phone, 'signup', 'sms');
    await sendOtpSms(phone, otp, 2);
    return res.json({ needsVerify: true, message: 'OTP sent' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const registerOtpCheck = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'phone and otp are required' });
    }


    const exists = await User.findOne({ where: { phone } });
    if (exists) {
      return res.status(409).json({ message: 'User already exists. Go to login' });
    }

    const otpRecord = await OtpCode.findOne({
      where: {
        phone,
        code: otp,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }


    otpRecord.used = true;
    await otpRecord.save();

    const signupToken = jwt.sign(
      { phone, onboarding: true },
      JWT_SECRET,
      { expiresIn: '15m' } 
    );

    return res.json({ signupToken, message: 'OTP verified' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const registerOtpComplete = async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No signup token' });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Signup token invalid/expired' });
    }

    if (!decoded.onboarding || !decoded.phone) {
      return res.status(403).json({ message: 'Invalid onboarding token' });
    }

    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'password is required' });

    
    const exists = await User.findOne({ where: { phone: decoded.phone } });
    if (exists) {
      return res.status(409).json({ message: 'User already exists. Go to login' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      phone: decoded.phone,
      password_hash,
      is_verified: true,
      role: 'user',
     
    });

    const loginToken = jwt.sign(
      { id: user.id, role: user.role, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({ message: 'Signup completed', token: loginToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const verifyPhone = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'phone and otp are required' });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const record = await OtpCode.findOne({
      where: {
        phone,
        code: otp,
        used: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    record.used = true;
    await record.save();

    user.is_verified = true;
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({ message: 'Phone verified', token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
  const { phoneOrEmail, password } = req.body;  

  try {
    
    let user;
    if (phoneOrEmail.includes('@')) {  
      user = await User.findOne({ where: { email: phoneOrEmail } });
    } else {  
      user = await User.findOne({ where: { phone: phoneOrEmail } });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Username or password' });
    }

    
    const token = jwt.sign({ id: user.id, role: user.role ,phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ message: 'Login successful', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { phone  } = req.body;

  try {
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const otp = await generateOTP(phone, 'reset', 'sms');
    await sendOtpSms(user.phone, otp, 2);
   

    res.json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;  

  try {

    const user = await User.findOne({ where: { phone: phone } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otpRecord = await OtpCode.findOne({
      where: {
        phone: phone,    
        code: otp,     
        used: false,    
        expires_at: { [Op.gt]: new Date() },  
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

  
    otpRecord.used = true;
    await otpRecord.save();



   
    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '30d' });

   
    res.status(200).json({
      message: 'OTP verified successfully. You can now reset your password.',
      token: token,  
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePassword = async (req, res) => {
  const { newPassword } = req.body;  

  try {
    
    const token = req.headers.authorization.split(' ')[1]; 

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    
    user.password_hash = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


