const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - order_id
 *         - client_id
 *         - master_id
 *         - rating
 *         - comment
 *       properties:
 *         id:
 *           type: integer
 *           description: Sharh unikal ID si
 *           example: 1
 *         order_id:
 *           type: string
 *           format: uuid
 *           description: Buyurtma ID si
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         client_id:
 *           type: string
 *           format: uuid
 *           description: Mijoz ID si
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         master_id:
 *           type: string
 *           format: uuid
 *           description: Usta ID si
 *           example: "550e8400-e29b-41d4-a716-446655440003"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Reyting (1-5)
 *           example: 5
 *         comment:
 *           type: string
 *           description: Sharh matni
 *           example: "Ajoyib ish, rahmat!"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Yaratilgan vaqti
 *           example: "2025-01-01T10:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Yangilangan vaqti
 *           example: "2025-01-01T10:00:00Z"
 */

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  client_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  master_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['order_id'], unique: true },
    { fields: ['client_id'] },
    { fields: ['master_id'] },
    { fields: ['rating'] }
  ]
});

module.exports = Review;
