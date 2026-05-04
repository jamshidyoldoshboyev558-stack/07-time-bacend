const { DataTypes } = require('sequelize');

/**
 * @swagger
 * components:
 *   schemas:
 *     MasterModels:
 *       type: object
 *       required:
 *         - user_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Usta modeli unikal ID si
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi ID si
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         rating:
 *           type: number
 *           format: float
 *           description: Usta reytingi
 *           example: 4.5
 *           default: 0
 *         total_orders:
 *           type: integer
 *           description: Jami buyurtmalar soni
 *           example: 25
 *           default: 0
 *         total_completed_orders:
 *           type: integer
 *           description: Tugatilgan buyurtmalar soni
 *           example: 20
 *           default: 0
 *         total_cancelled_orders:
 *           type: integer
 *           description: Bekor qilingan buyurtmalar soni
 *           example: 5
 *           default: 0
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

const MasterModels = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    total_orders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_completed_orders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_cancelled_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0 
    }
    };