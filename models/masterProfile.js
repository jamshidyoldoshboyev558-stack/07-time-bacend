const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// Circular dependency oldini olish - User references keyin
// const { User } = require('./index');

/**
 * @swagger
 * components:
 *   schemas:
 *     MasterProfile:
 *       type: object
 *       required:
 *         - user_id
 *         - specialty
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Usta profili unikal ID si
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi ID si
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         specialty:
 *           type: string
 *           maxLength: 150
 *           description: Mutaxassislik
 *           example: "Elektrik"
 *         experience_years:
 *           type: integer
 *           minimum: 0
 *           maximum: 50
 *           description: Tajriba yillari
 *           example: 5
 *           default: 0
 *         rating:
 *           type: number
 *           format: decimal
 *           minimum: 0.00
 *           maximum: 10.00
 *           description: Reyting
 *           example: 4.5
 *           default: 0.00
 *         total_reviews:
 *           type: integer
 *           description: Jami sharhlar soni
 *           example: 25
 *           default: 0
 *         portfolio_images:
 *           type: array
 *           items:
 *             type: string
 *           description: Portfolio rasmlari
 *           example: ["work1.jpg", "work2.jpg"]
 *           default: []
 *         bio:
 *           type: string
 *           description: Biografiya
 *           example: "5 yillik tajribaga ega elektrik"
 *         is_available:
 *           type: boolean
 *           description: Mavjudligi
 *           example: true
 *           default: true
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
const MasterProfile = sequelize.define('MasterProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
    // references keyinroq index.js da
  },
  specialty: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 50
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0.00,
      max: 10.00
    }
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  portfolio_images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  bio: {
    type: DataTypes.TEXT
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'master_profiles',
  timestamps: true,
  underscored: true
});

module.exports = MasterProfile;
