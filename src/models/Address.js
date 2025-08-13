import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Address = sequelize.define('Address', {
  address: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  floor: {
    type: DataTypes.STRING,
    allowNull: true,  
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,  
  }
}, {
  tableName: 'addresses',  
  underscored: true,
  timestamps: true,
});

Address.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Address, { foreignKey: 'user_id' });

export default Address;
