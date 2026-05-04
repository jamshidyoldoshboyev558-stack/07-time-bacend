const { Payment, Order } = require('../models');
const crypto = require('crypto');
const { Op } = require('sequelize');


const COMMISSION_RATE = 0.05; 

exports.createPayment = async (req, res) => {
    try {
        const { order_id, method, amount } = req.body;
        const user_id = req.user.id;

  
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({ error: 'Buyurtma topilmadi' });
        }

        if (order.client_id !== user_id) {
            return res.status(403).json({ error: 'Ruxsat berilmagan' });
        }

        const existingPayment = await Payment.findByOrderId(order_id);
        if (existingPayment && existingPayment.status === 'completed') {
            return res.status(400).json({ error: 'Bu buyurtma uchun tolov amalga oshirilgan' });
        }

     
        const commissionAmount = amount * COMMISSION_RATE;
        const netAmount = amount - commissionAmount;

       
        const payment = await Payment.create({
            order_id,
            user_id,
            amount,
            commission_amount: commissionAmount,
            net_amount: netAmount,
            method,
            transaction_id: `TXN_${Date.now()}_${crypto.randomBytes(8).toString('hex').toUpperCase()}`
        });

        res.status(201).json({
            message: 'Tolov yaratildi',
            payment: {
                id: payment.id,
                order_id: payment.order_id,
                amount: payment.amount,
                commission_amount: payment.commission_amount,
                net_amount: payment.net_amount,
                method: payment.method,
                status: payment.status,
                transaction_id: payment.transaction_id,
                created_at: payment.created_at
            }
        });
    } catch (error) {
        console.error('Tolov yaratish xatosi:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
};

exports.processPayment = async (req, res) => {
    try {
        const { payment_id, external_payment_id } = req.body;

        const payment = await Payment.findByPk(payment_id);
        if (!payment) {
            return res.status(404).json({ error: 'Tolov topilmadi' });
        }

        if (payment.status !== 'pending') {
            return res.status(400).json({ error: 'Tolov allaqachon qayta ishlangan' });
        }

        if (external_payment_id) {
            payment.external_payment_id = external_payment_id;
        }

        payment.status = 'processing';
        await payment.save();

        setTimeout(async () => {
            try {
                await payment.markAsCompleted(payment.transaction_id);
                
   
                const order = await Order.findByPk(payment.order_id);
                if (order) {
                    order.status = 'paid';
                    await order.save();
                }
            } catch (error) {
                await payment.markAsFailed('Tolov tizimi xatosi');
            }
        }, 2000);

        res.json({
            message: 'Tolov qayta ishlash boshlandi',
            payment: {
                id: payment.id,
                status: payment.status,
                transaction_id: payment.transaction_id
            }
        });
    } catch (error) {
        console.error('Tolov qayta ishlash xatosi:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const user_id = req.user.id;

        const payment = await Payment.findByPk(payment_id);
        if (!payment) {
            return res.status(404).json({ error: 'Tolov topilmadi' });
        }

     
        if (payment.user_id !== user_id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Ruxsat berilmagan' });
        }

        res.json({
            payment: {
                id: payment.id,
                order_id: payment.order_id,
                amount: payment.amount,
                commission_amount: payment.commission_amount,
                net_amount: payment.net_amount,
                method: payment.method,
                status: payment.status,
                transaction_id: payment.transaction_id,
                payment_date: payment.payment_date,
                refund_date: payment.refund_date,
                refund_reason: payment.refund_reason,
                created_at: payment.created_at,
                updated_at: payment.updated_at
            }
        });
    } catch (error) {
        console.error('Tolov statusini olish xatosi:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
};

exports.getUserPaymentHistory = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 20, status } = req.query;

        const whereClause = { user_id };
        if (status) {
            whereClause.status = status;
        }

        const offset = (page - 1) * limit;

        const { count, rows: payments } = await Payment.findAndCountAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{
                model: Order,
                attributes: ['id', 'description', 'status']
            }]
        });

        res.json({
            payments,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Tolov tarixini olish xatosi:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
};

exports.refundPayment = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const { refund_reason } = req.body;

        const payment = await Payment.findByPk(payment_id);
        if (!payment) {
            return res.status(404).json({ error: 'Tolov topilmadi' });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({ error: 'Faqat tugallangan tolovlar qaytarilishi mumkin' });
        }

   
        if (payment.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Ruxsat berilmagan' });
        }

        await payment.processRefund(refund_reason || 'Foydalanuvchi sovrasi');

        const order = await Order.findByPk(payment.order_id);
        if (order) {
            order.status = 'refunded';
            await order.save();
        }

        res.json({
            message: 'Tolov muvaffaqiyatli qaytarildi',
            payment: {
                id: payment.id,
                status: payment.status,
                refund_date: payment.refund_date,
                refund_reason: payment.refund_reason
            }
        });
    } catch (error) {
        console.error('Tolov qaytarish xatosi:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
};

exports.getPaymentStats = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

  
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Ruxsat berilmagan' });
        }

        const startDate = start_date ? new Date(start_date) : null;
        const endDate = end_date ? new Date(end_date) : null;

        const totalRevenue = await Payment.getTotalRevenue(startDate, endDate);
        
        const paymentStats = await Payment.findAll({
            where: startDate && endDate ? {
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            } : {},
            attributes: [
                'status',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
                [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total_amount']
            ],
            group: ['status']
        });

        const methodStats = await Payment.findAll({
            where: startDate && endDate ? {
                created_at: {
                    [Op.between]: [startDate, endDate]
                }
            } : {},
            attributes: [
                'method',
                [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
                [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total_amount']
            ],
            group: ['method']
        });

        res.json({
            total_revenue: totalRevenue || 0,
            payment_stats: paymentStats,
            method_stats: methodStats,
            period: {
                start_date: startDate,
                end_date: endDate
            }
        });
    } catch (error) {
        console.error('Tolov statistikasini olish xatosi:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
};

exports.getPendingPayments = async (req, res) => {
    try {
       
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Ruxsat berilmagan' });
        }

        const pendingPayments = await Payment.findPendingPayments();

        res.json({
            pending_payments: pendingPayments,
            count: pendingPayments.length
        });
    } catch (error) {
        console.error('Kutilayotgan tolovlarni olish xatosi:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
};
