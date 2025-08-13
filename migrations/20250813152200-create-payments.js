// migrations/20250813_create-payments.js
import { Sequelize } from 'sequelize';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders', 
          key: 'id',
        },
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,  
      },
      payment_status: {
        type: Sequelize.STRING,
        defaultValue: 'pending', 
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  },
};
