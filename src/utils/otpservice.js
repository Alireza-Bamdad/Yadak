//utils/otpservice.js
import OtpCode from '../models/OtpCode.js';  
import { Op } from 'sequelize';

export const generateOTP = async (phone, type, method) => {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();  
  const expiresAt = new Date(Date.now() + (2 * 60 * 1000)); 

  await OtpCode.destroy({
    where: {
      expires_at: { [Op.lt]: new Date() }  
    }
  });

  await OtpCode.create({
    phone: phone,
    code: otp,
    type: type,
    method: method,
    expires_at: expiresAt,
    used: false,
  });

  return otp; 
};


