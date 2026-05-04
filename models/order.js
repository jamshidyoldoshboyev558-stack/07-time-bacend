const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ORDER_STATUS = [
    "pending",
    "accepted",
    "in_progress",
    "done",
    "cancelled",
    "paid",
    "refunded"
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - client_id
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Buyurtma unikal ID si
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         client_id:
 *           type: string
 *           format: uuid
 *           description: Mijoz ID si
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         master_id:
 *           type: string
 *           format: uuid
 *           description: Usta ID si (ixtiyoriy)
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         description:
 *           type: string
 *           description: Buyurtma tavsifi
 *           example: "Kompayterni ta'mirlash kerak"
 *         status:
 *           type: string
 *           enum: [pending, accepted, in_progress, done, cancelled, paid, refunded]
 *           description: Buyurtma statusi
 *           example: "pending"
 *           default: "pending"
 *         region:
 *           type: string
 *           maxLength: 100
 *           description: Buyurtma hududi
 *           example: "Olmaliq"
 *         price:
 *           type: number
 *           format: decimal
 *           description: Buyurtma narxi
 *           example: 150000.00
 *         commission_rate:
 *           type: number
 *           format: decimal
 *           description: Komissiya foizi
 *           example: 0.05
 *         commission_amount:
 *           type: number
 *           format: decimal
 *           description: Komissiya miqdori
 *           example: 7500.00
 *         proof_images:
 *           type: array
 *           items:
 *             type: string
 *           description: Ish bajarilganligi isboti rasmlari
 *           example: ["image1.jpg", "image2.jpg"]
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: Tugatilgan vaqti
 *           example: "2025-01-01T15:30:00Z"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Yaratilgan vaqti
 *           example: "2025-01-01T10:00:00Z"
 */
const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    client_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    master_id: {
        type: DataTypes.UUID
    },

    description: {
        type: DataTypes.TEXT
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        validate: {
            isIn: [ORDER_STATUS]
        }
    },

    region: DataTypes.STRING(100),
    price: DataTypes.DECIMAL(12, 2),
    commission_rate: DataTypes.DECIMAL(4, 2),
    commission_amount: DataTypes.DECIMAL(12, 2),

    proof_images: {
        type: DataTypes.JSON
    },

    completed_at: DataTypes.DATE

}, {
    tableName: "orders",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: false
})

module.exports = Order;