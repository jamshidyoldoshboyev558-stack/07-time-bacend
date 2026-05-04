const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - full_name
 *         - phone
 *         - password_hash
 *         - role
 *         - region
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi unikal ID si
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         full_name:
 *           type: string
 *           maxLength: 100
 *           description: Foydalanuvchi to'liq ismi
 *           example: "Jamshid Abdullayev"
 *         phone:
 *           type: string
 *           maxLength: 20
 *           description: Telefon raqami (unikal)
 *           example: "+998901234567"
 *         email:
 *           type: string
 *           format: email
 *           description: Email manzili (ixtiyoriy, unikal)
 *           example: "jamshid@example.com"
 *         password_hash:
 *           type: string
 *           maxLength: 255
 *           description: Parol xeshi (bcrypt)
 *           example: "$2b$12$..."
 *         role:
 *           type: string
 *           enum: [mijoz, usta, sotuvchi]
 *           description: Foydalanuvchi roli
 *           example: "mijoz"
 *         region:
 *           type: string
 *           maxLength: 100
 *           description: Foydalanuvchi hududi
 *           example: "Olmaliq"
 *           default: "Olmaliq"
 *         is_verified:
 *           type: boolean
 *           description: Telefon tasdiqlanganmi
 *           example: false
 *           default: false
 *         is_active:
 *           type: boolean
 *           description: Foydalanuvchi aktivmi
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
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(150),
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('mijoz', 'usta', 'sotuvchi'),
    allowNull: false
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Olmaliq'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password_hash')) {
        user.password_hash = await bcrypt.hash(user.password_hash, 12);
      }
    }
  }
});

// Password check helper
User.prototype.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;
