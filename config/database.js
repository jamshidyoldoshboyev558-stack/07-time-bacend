const { Sequelize } = require('sequelize');
require('dotenv').config();

// DATABASE_URL dan parse qilish yoki alohida vars
const {
  DB_HOST = 'localhost',
  DB_PORT = '5432', 
  DB_NAME = 'time07',
  DB_USER = 'postgres',
  DB_PASS = 'password',
  DATABASE_URL
} = process.env;

const sequelize = new Sequelize(DATABASE_URL || `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  dialect: 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  dialectOptions: {
    // PostgreSQL uchun
    timezone: 'Asia/Tashkent',
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize PostgreSQL ga ulandi'))
  .catch(err => console.error('❌ Sequelize ulanish xatosi:', err));

module.exports = sequelize;
