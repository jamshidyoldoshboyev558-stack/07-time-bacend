const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PAYMENT_STATUS = [
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
];

const PAYMENT_METHOD = [
    'cash',
    'click',
    'payme',
    'uzum',
    'bank_card'
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - order_id
 *         - user_id
 *         - amount
 *         - net_amount
 *         - method
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Tolov unikal ID si
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         order_id:
 *           type: string
 *           format: uuid
 *           description: Buyurtma ID si
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi ID si
 *           example: "550e8400-e29b-41d4-a716-446655440002"
 *         amount:
 *           type: number
 *           format: decimal
 *           description: Tolov summasi
 *           example: 150000.00
 *         commission_amount:
 *           type: number
 *           format: decimal
 *           description: Komissiya miqdori
 *           example: 7500.00
 *           default: 0.00
 *         net_amount:
 *           type: number
 *           format: decimal
 *           description: Toza summa
 *           example: 142500.00
 *         method:
 *           type: string
 *           enum: [cash, click, payme, uzum, bank_card]
 *           description: Tolov usuli
 *           example: "click"
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, failed, refunded]
 *           description: Tolov statusi
 *           example: "pending"
 *         transaction_id:
 *           type: string
 *           description: Tranzaksiya ID si
 *           example: "TXN_123456789"
 *         external_payment_id:
 *           type: string
 *           description: Tashqi tolov ID si
 *           example: "EXT_123456"
 *         payment_date:
 *           type: string
 *           format: date-time
 *           description: Tolov sanasi
 *           example: "2025-01-01T10:00:00Z"
 *         refund_date:
 *           type: string
 *           format: date-time
 *           description: Qaytarish sanasi
 *           example: "2025-01-02T10:00:00Z"
 *         refund_reason:
 *           type: string
 *           description: Qaytarish sababi
 *           example: "Mijoz so'rashi bilan"
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
const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    commission_amount: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    net_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    method: {
        type: DataTypes.ENUM(PAYMENT_METHOD),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(PAYMENT_STATUS),
        defaultValue: 'pending'
    },
    transaction_id: {
        type: DataTypes.STRING,
        unique: true
    },
    external_payment_id: {
        type: DataTypes.STRING
    },
    payment_date: {
        type: DataTypes.DATE
    },
    refund_date: {
        type: DataTypes.DATE
    },
    refund_reason: {
        type: DataTypes.TEXT
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE.NOW
    }
}, {
    tableName: 'payments',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['order_id']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['method']
        },
        {
            fields: ['transaction_id'],
            unique: true
        },
        {
            fields: ['created_at']
        }
    ]
});


Payment.prototype.markAsCompleted = function(transactionId, paymentDate = new Date()) {
    this.status = 'completed';
    this.transaction_id = transactionId;
    this.payment_date = paymentDate;
    return this.save();
};

Payment.prototype.markAsFailed = function(reason) {
    this.status = 'failed';
    this.metadata = { ...this.metadata, failure_reason: reason };
    return this.save();
};

Payment.prototype.processRefund = function(refundReason) {
    this.status = 'refunded';
    this.refund_date = new Date();
    this.refund_reason = refundReason;
    return this.save();
};


Payment.findByOrderId = function(orderId) {
    return this.findOne({
        where: { order_id: orderId },
        order: [['created_at', 'DESC']]
    });
};

Payment.findPendingPayments = function() {
    return this.findAll({
        where: { status: 'pending' },
        order: [['created_at', 'ASC']]
    });
};

Payment.getUserPaymentHistory = function(userId, limit = 50) {
    return this.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit
    });
};

Payment.getTotalRevenue = function(startDate, endDate) {
    const whereClause = {
        status: 'completed'
    };
    
    if (startDate && endDate) {
        whereClause.payment_date = {
            [sequelize.Sequelize.Op.between]: [startDate, endDate]
        };
    }
    
    return this.sum('net_amount', {
        where: whereClause
    });
};

module.exports = Payment;