// src/migrations/20250813125251-create-address.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,  
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,  
      },
      floor: {
        type: Sequelize.STRING,
        allowNull: true,  
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true, 
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        references: {
          model: 'users',  
          key: 'id',
        },
        onDelete: 'CASCADE',  
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('addresses');
  }
};
