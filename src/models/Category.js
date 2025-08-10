
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.cjs';

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  underscored: true,
  timestamps: true,
});

export default Category;
