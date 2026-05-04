const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = sequelize;

/**
 * @swagger
 * components:
 *   schemas:
 *     UserToken:
 *       type: object
 *       required:
 *         - user_id
 *         - token
 *         - type
 *         - expires_at
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Token unikal ID si
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi ID si
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         token:
 *           type: string
 *           description: Token xeshi
 *           example: "a1b2c3d4e5f6..."
 *         type:
 *           type: string
 *           enum: [refresh]
 *           description: Token turi
 *           example: "refresh"
 *           default: "refresh"
 *         expires_at:
 *           type: string
 *           format: date-time
 *           description: Token muddati tugash vaqti
 *           example: "2025-01-31T10:00:00Z"
 *         is_valid:
 *           type: boolean
 *           description: Token yaroqliligi
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
 *     TokenValidation:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Token yaroqli"
 *         token:
 *           $ref: '#/components/schemas/UserToken'
 */
const UserToken = sequelize.define('UserToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('refresh'),
    defaultValue: 'refresh',
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'user_tokens',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'type'] },
    { fields: ['token'], unique: true },
    { fields: ['expires_at'] }
  ]
});

// Cleanup expired/invalid
UserToken.cleanup = async () => {
  await UserToken.destroy({
    where: {
      [Op.or]: [
        { expires_at: { [Op.lt]: new Date() } },
        { is_valid: false }
      ]
    }
  });
};

// Find valid refresh for user
UserToken.findValidRefresh = async (tokenHash) => {
  const { Op } = require('sequelize');
  return await UserToken.findOne({
    where: {
      token: tokenHash,
      is_valid: true,
      expires_at: { [Op.gt]: new Date() }
    }
  });
};

module.exports = UserToken;

