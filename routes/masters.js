const express = require('express');
const router = express.Router();
const masterController = require('../controllers/Profile');
const authMiddleware = require('../middleware/auth');
const { cancelOrder } = require("../controllers/order");

/**
 * @swagger
 * tags:
 *   name: Masters
 *   description: Ustalar boshqaruvi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MasterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Ustalar ro'yxati"
 *         masters:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MasterProfile'
 *     PortfolioRequest:
 *       type: object
 *       required:
 *         - image
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 *           description: Portfolio rasmi
 */

/**
 * @swagger
 * /api/masters:
 *   get:
 *     summary: Barcha ustalarni olish
 *     tags: [Masters]
 *     responses:
 *       200:
 *         description: Ustalar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MasterResponse'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', masterController.getMasters);

/**
 * @swagger
 * /api/masters/{id}:
 *   get:
 *     summary: Usta ma'lumotlarini olish
 *     tags: [Masters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Usta ID
 *     responses:
 *       200:
 *         description: Usta ma'lumotlari
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MasterProfile'
 *       404:
 *         description: Usta topilmadi
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
router.get('/:id', masterController.getMasterById);

/**
 * @swagger
 * /api/masters/cancel/{id}:
 *   put:
 *     summary: Buyurtmani bekor qilish
 *     tags: [Masters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Buyurtma ID
 *     responses:
 *       200:
 *         description: Buyurtma bekor qilindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
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
router.put("/cancel/:id", cancelOrder);

/**
 * @swagger
 * /api/masters/portfolio:
 *   post:
 *     summary: Portfolio rasm qo'shish
 *     tags: [Masters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/PortfolioRequest'
 *     responses:
 *       200:
 *         description: Rasm muvaffaqiyatli qo'shildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Portfolio rasm qo'shildi"
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/portfolio', authMiddleware, masterController.addPortfolioImage);

/**
 * @swagger
 * /api/masters/orders/{id}/cancel:
 *   put:
 *     summary: Usta buyurtmasini bekor qilish
 *     tags: [Masters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Buyurtma ID
 *     responses:
 *       200:
 *         description: Buyurtma bekor qilindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
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
router.put('/orders/:id/cancel', authMiddleware, cancelOrder);

/**
 * @swagger
 * /api/masters/orders:
 *   get:
 *     summary: Usta buyurtmalarini olish
 *     tags: [Masters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usta buyurtmalari
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/orders', authMiddleware, masterController.getMasterOrders);

module.exports = router;
