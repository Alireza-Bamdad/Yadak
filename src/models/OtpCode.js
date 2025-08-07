import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const OtpCode = sequelize.define('OtpCode', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,  // 'reset', 'login' و غیره
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false,  // 'sms', 'email'
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true, 
  underscored: true,  
});

export default OtpCode;
