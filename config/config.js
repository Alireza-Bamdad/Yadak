import { config as dotenvConfig } from 'dotenv';
dotenvConfig(); 

export default {
  development: {
    username: process.env.DB_USER || 'your_database_user',
    password: process.env.DB_PASSWORD || 'your_database_password',
    database: process.env.DB_NAME || 'your_database_name',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,  
  },
  test: {
    username: process.env.DB_USER || 'your_database_user',
    password: process.env.DB_PASSWORD || 'your_database_password',
    database: process.env.DB_NAME || 'your_test_database_name',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,  
  },
  production: {
    username: process.env.DB_USER || 'your_database_user',
    password: process.env.DB_PASSWORD || 'your_database_password',
    database: process.env.DB_NAME || 'your_production_database_name',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    logging: false,
  },
};
