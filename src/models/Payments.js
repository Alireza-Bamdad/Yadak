import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Order from './Order.js';

const Payment = sequelize.define('Payment', {
  payment_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',  
  },
}, {
  underscored: true,
  timestamps: true,
});

Payment.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Payment, { foreignKey: 'order_id' });

export default Payment;
