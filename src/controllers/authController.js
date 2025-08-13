
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendOtpSms } from '../utils/sms.js'; 
import { generateOTP } from '../utils/otpservice.js'; 
import OtpCode from '../models/OtpCode.js'; 
import { Op } from 'sequelize';
import {
  handleServerError,
  handleValidationError,
  handleNotFound,
  handleConflict,
  handleUnauthorized ,
} from '../errorHandling/errorHandler.js';
import { log } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerOtpBegin = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return handleValidationError(res, 'شماره تلفن');

  try {
    const exists = await User.findOne({ where: { phone } });
    if (exists) return res.json({ exists: true, message: 'کاربر وجود دارد. لطفاً وارد شوید.' });

    const otp = await generateOTP(phone, 'signup', 'sms');
    await sendOtpSms(phone, otp, 2);
    log('ارسال کد تأیید ثبت‌نام', { phone });

    return res.json({ needsVerify: true, message: 'کد تأیید ارسال شد' });
  } catch (e) {
    return handleServerError(res, e, 'خطا در ارسال کد تأیید');
  }
};

export const registerOtpCheck = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return handleValidationError(res, 'شماره تلفن و کد تأیید');

  try {
    const exists = await User.findOne({ where: { phone } });
    if (exists) return handleConflict(res, 'شماره تلفن');

    const otpRecord = await OtpCode.findOne({
      where: { phone, code: otp, used: false, expires_at: { [Op.gt]: new Date() } },
    });
    if (!otpRecord) return res.status(400).json({ message: 'کد تأیید نامعتبر یا منقضی شده است' });

    otpRecord.used = true;
    await otpRecord.save();

    const signupToken = jwt.sign({ phone, onboarding: true }, JWT_SECRET, { expiresIn: '15m' });
    return res.json({ signupToken, message: 'کد تأیید معتبر است' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const registerOtpComplete = async (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return handleUnauthorized(res, 'توکن ثبت‌نام وجود ندارد');

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleUnauthorized(res, 'توکن منقضی یا نامعتبر است');
  }

  if (!decoded.onboarding || !decoded.phone) {
    return res.status(403).json({ message: 'توکن ثبت‌نام معتبر نیست' });
  }

  const { password, first_name, last_name } = req.body;
  if (!password) return handleValidationError(res, 'رمز عبور');

  try {
    const exists = await User.findOne({ where: { phone: decoded.phone } });
    if (exists) return handleConflict(res, 'شماره تلفن');

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      phone: decoded.phone,
      password_hash,
      is_verified: true,
      role: 'user',
      first_name: first_name || '',
      last_name: last_name || '',
    });

    const loginToken = jwt.sign({ id: user.id, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({ message: 'ثبت‌نام با موفقیت انجام شد', token: loginToken });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return handleValidationError(res, 'شماره تلفن و رمز عبور');

  try {
    const user = await User.findOne({ where: { phone } });
    if (!user) return handleNotFound(res, 'کاربر');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'شماره تلفن یا رمز اشتباه است' });

    const token = jwt.sign({ id: user.id, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ message: 'ورود موفقیت‌آمیز', token });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const forgotPassword = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return handleValidationError(res, 'شماره تلفن');

  try {
    const user = await User.findOne({ where: { phone } });
    if (!user) return handleNotFound(res, 'کاربر');

    const otp = await generateOTP(phone, 'reset', 'sms');
    await sendOtpSms(phone, otp, 2);

    return res.json({ message: 'کد بازیابی رمز عبور ارسال شد' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return handleValidationError(res, 'شماره تلفن و کد تأیید');

  try {
    const user = await User.findOne({ where: { phone } });
    if (!user) return handleNotFound(res, 'کاربر');

    const otpRecord = await OtpCode.findOne({
      where: { phone, code: otp, used: false, expires_at: { [Op.gt]: new Date() } },
    });
    if (!otpRecord) return res.status(400).json({ message: 'کد تأیید نامعتبر یا منقضی شده است' });

    otpRecord.used = true;
    await otpRecord.save();

    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({ message: 'کد تأیید معتبر است. اکنون می‌توانید رمز عبور را تغییر دهید.', token });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return handleValidationError(res, 'رمز عبور جدید');

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return handleUnauthorized(res);

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return handleNotFound(res, 'کاربر');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashed;
    await user.save();

    return res.status(200).json({ message: 'رمز عبور با موفقیت به‌روزرسانی شد' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return handleNotFound(res, 'کاربر');

    res.json({
      id: user.id,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      email: user.email || null,
    });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const updateProfile = async (req, res) => {
  const { first_name, last_name, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return handleNotFound(res, 'کاربر');

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) return handleConflict(res, 'ایمیل');
      user.email = email;
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    await user.save();

    res.json({ message: 'پروفایل با موفقیت به‌روزرسانی شد' });
  } catch (e) {
    return handleServerError(res, e);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // برای حذف توکن از کوکی
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
