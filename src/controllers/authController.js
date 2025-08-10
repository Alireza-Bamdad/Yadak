import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendSms } from '../utils/sms.js'; 
import { generateOTP } from '../utils/otpservice.js' 
import OtpCode from '../models/OtpCode.js'; 
import { Op } from 'sequelize';






export const register = async (req, res) => {
  const { first_name, last_name, phone, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      phone,
      email,
      password_hash: hashedPassword,  
    });
        res.status(201).json({ message: 'Registration successful. Pleas verfiy yor email and phone number', userId: newUser.id });
    }catch(error){
        res.json({message : "Invalid data"})
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

    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

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
    
   
    sendSms(user.phone, `Your OTP for password reset is: ${otp}`);

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