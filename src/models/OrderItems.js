import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Product from './Product.js';
import Order from './Order.js';

const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_at_time: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  underscored: true,
  timestamps: true,
});

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });

export default OrderItem;
