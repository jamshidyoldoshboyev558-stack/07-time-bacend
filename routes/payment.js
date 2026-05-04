const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

// Barcha route larda autentifikatsiya talab qilinadi
router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePaymentRequest:
 *       type: object
 *       required:
 *         - order_id
 *         - method
 *         - amount
 *       properties:
 *         order_id:
 *           type: string
 *           format: uuid
 *           description: Buyurtma ID
 *         method:
 *           type: string
 *           enum: [cash, click, payme, uzum, bank_card]
 *           description: Tolov usuli
 *         amount:
 *           type: number
 *           format: decimal
 *           description: Tolov summasi
 *     ProcessPaymentRequest:
 *       type: object
 *       properties:
 *         payment_id:
 *           type: string
 *           format: uuid
 *           description: Tolov ID
 *         external_payment_id:
 *           type: string
 *           description: Tashqi tolov ID (ixtiyoriy)
 *     RefundPaymentRequest:
 *       type: object
 *       properties:
 *         refund_reason:
 *           type: string
 *           description: Qaytarish sababi
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Xabarnoma
 *         payment:
 *           $ref: '#/components/schemas/Payment'
 *     PaymentHistoryResponse:
 *       type: object
 *       properties:
 *         payments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Payment'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             pages:
 *               type: integer
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Yangi tolov yaratish
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentRequest'
 *     responses:
 *       201:
 *         description: Tolov muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Xato so'rov
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Ruxsat berilmagan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Buyurtma topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/create', 
    roleMiddleware('mijoz'), 
    paymentController.createPayment
);

/**
 * @swagger
 * /api/payments/process:
 *   post:
 *     summary: Tolovni qayta ishlash
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessPaymentRequest'
 *     responses:
 *       200:
 *         description: Tolov qayta ishlash boshlandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     transaction_id:
 *                       type: string
 *       400:
 *         description: Tolov allaqachon qayta ishlangan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tolov topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/process', 
    roleMiddleware('mijoz'), 
    paymentController.processPayment
);

/**
 * @swagger
 * /api/payments/status/{payment_id}:
 *   get:
 *     summary: Tolov statusini olish
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tolov ID
 *     responses:
 *       200:
 *         description: Tolov ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       403:
 *         description: Ruxsat berilmagan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tolov topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/status/:payment_id', 
    paymentController.getPaymentStatus
);

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Foydalanuvchi tolov tarixi
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Elementlar soni
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, failed, refunded]
 *         description: Tolov statusi bo'yicha filter
 *     responses:
 *       200:
 *         description: Tolov tarixi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentHistoryResponse'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/history', 
    paymentController.getUserPaymentHistory
);

/**
 * @swagger
 * /api/payments/{payment_id}/refund:
 *   post:
 *     summary: Tolovni qaytarish
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tolov ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefundPaymentRequest'
 *     responses:
 *       200:
 *         description: Tolov muvaffaqiyatli qaytarildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     refund_date:
 *                       type: string
 *                       format: date-time
 *                     refund_reason:
 *                       type: string
 *       400:
 *         description: Faqat tugallangan tolovlar qaytarilishi mumkin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Ruxsat berilmagan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tolov topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:payment_id/refund', 
    paymentController.refundPayment
);

/**
 * @swagger
 * /api/payments/stats:
 *   get:
 *     summary: Tolov statistikasi (faqat adminlar uchun)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Boshlanish sanasi
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Tugash sanasi
 *     responses:
 *       200:
 *         description: Tolov statistikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_revenue:
 *                   type: number
 *                   format: decimal
 *                 payment_stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       total_amount:
 *                         type: number
 *                           format: decimal
 *                 method_stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       method:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       total_amount:
 *                         type: number
 *                           format: decimal
 *                 period:
 *                   type: object
 *                   properties:
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Ruxsat berilmagan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', 
    roleMiddleware('admin'), 
    paymentController.getPaymentStats
);

/**
 * @swagger
 * /api/payments/pending:
 *   get:
 *     summary: Kutilayotgan tolovlarni olish (faqat adminlar uchun)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kutilayotgan tolovlar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pending_payments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 count:
 *                   type: integer
 *       403:
 *         description: Ruxsat berilmagan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/pending', 
    roleMiddleware('admin'), 
    paymentController.getPendingPayments
);

module.exports = router;
