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