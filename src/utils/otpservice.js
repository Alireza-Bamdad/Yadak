import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import OtpCode from '../models/OtpCode.js';  

export const generateOTP = async (userId, type, method) => {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();  
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);  //5min


  await OtpCode.create({
    user_id: userId,
    code: otp,
    type,
    method,
    expires_at: expiresAt,
    used: false,
  });

  return otp;
};
