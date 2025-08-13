import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Order = sequelize.define('Order', {
  order_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'processing',
  },
}, {
  underscored: true,
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

export default Order;
