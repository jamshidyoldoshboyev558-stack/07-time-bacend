const { Sequelize } = require('sequelize');
require('dotenv').config();

// Environment variable lardan ma'lumot olish
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5432';
const DB_NAME = process.env.DB_NAME || 'time07';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_SSL = process.env.DB_SSL === 'true';
const DB_MAX_POOL = process.env.DB_MAX_POOL || '10';
const DB_MIN_POOL = process.env.DB_MIN_POOL || '0';
const DB_ACQUIRE_TIMEOUT = process.env.DB_ACQUIRE_TIMEOUT || '30000';
const DB_IDLE_TIMEOUT = process.env.DB_IDLE_TIMEOUT || '10000';

const sequelize = new Sequelize(DATABASE_URL || `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  dialect: 'postgres',
  ssl: NODE_ENV === 'production' || DB_SSL ? { rejectUnauthorized: false } : false,
  dialectOptions: {
    timezone: process.env.DB_TIMEZONE || 'Asia/Tashkent',
  },
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: parseInt(DB_MAX_POOL),
    min: parseInt(DB_MIN_POOL),
    acquire: parseInt(DB_ACQUIRE_TIMEOUT),
    idle: parseInt(DB_IDLE_TIMEOUT)
  }
});

sequelize.authenticate()
  .then(() => console.log(' Sequelize PostgreSQL ga ulandi'))
  .catch(err => console.error(' Sequelize ulanish xatosi:', err));

module.exports = sequelize;
