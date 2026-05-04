const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     BlacklistToken:
 *       type: object
 *       required:
 *         - token
 *         - expires_at
 *         - user_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Token unikal ID si
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         token:
 *           type: string
 *           description: Blacklistga qo'shilgan token xeshi
 *           example: "a1b2c3d4e5f6..."
 *         expires_at:
 *           type: string
 *           format: date-time
 *           description: Token muddati tugash vaqti
 *           example: "2025-01-31T10:00:00Z"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi ID si
 *           example: "550e8400-e29b-41d4-a716-446655440001"
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
 *     TokenCleanup:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Eskirgan tokenlar tozalandi"
 *         deleted_count:
 *           type: integer
 *           description: O'chirilgan tokenlar soni
 *           example: 5
 */
const BlacklistToken = sequelize.define('BlacklistToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'blacklist_tokens',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['token']
    },
    {
      fields: ['expires_at']
    }
  ]
});

const { Op } = require('sequelize');
BlacklistToken.cleanup = async () => {
  await BlacklistToken.destroy({
    where: { expires_at: { [Op.lt]: new Date() } }
  });
};

module.exports = BlacklistToken;

