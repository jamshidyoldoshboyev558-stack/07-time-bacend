const express = require('express');
const router = express.Router();

const orderController = require("../controllers/order");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const role = require('../middleware/role');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Buyurtmalar boshqaruvi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReviewRequest:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *       properties:
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Reyting (1-5)
 *           example: 5
 *         comment:
 *           type: string
 *           description: Sharh matni
 *           example: "Ajoyib ish, rahmat!"
 *     OrderStatusUpdate:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Buyurtma statusi yangilandi"
 *         order:
 *           $ref: '#/components/schemas/Order'
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Yangi buyurtma yaratish
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Buyurtma muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Xato so'rov yoki noto'g'ri ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       403:
 *         description: Ruxsat berilmagan (faqat mijoz)
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
router.post(
  "/", 
  roleMiddleware("mijoz"),
  orderController.createOrder
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Buyurtmani olish
 *     tags: [Orders]
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
 *         description: Buyurtma ma'lumotlari
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
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       403:
 *         description: Ruxsat berilmagan (faqat mijoz yoki usta)
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
router.get(
  "/:id",
  roleMiddleware("mijoz", "usta"),
  orderController.getOrder
);

/**
 * @swagger
 * /api/orders/{id}/accept:
 *   put:
 *     summary: Buyurtmani qabul qilish
 *     tags: [Orders]
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
 *         description: Buyurtma qabul qilindi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStatusUpdate'
 *       404:
 *         description: Buyurtma topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       403:
 *         description: Ruxsat berilmagan (faqat usta)
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
router.put(
  "/:id/accept",
  roleMiddleware("usta"),
  orderController.acceptedOrder
);

/**
 * @swagger
 * /api/orders/{id}/complete:
 *   put:
 *     summary: Buyurtmani tugatish
 *     tags: [Orders]
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
 *         description: Buyurtma tugatildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderStatusUpdate'
 *       404:
 *         description: Buyurtma topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       403:
 *         description: Ruxsat berilmagan (faqat usta)
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
router.put(
  "/:id/complete",
  roleMiddleware("usta"),
  orderController.completeOrder
);

/**
 * @swagger
 * /api/orders/{id}/review:
 *   post:
 *     summary: Buyurtmaga sharh qoldirish
 *     tags: [Orders]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewRequest'
 *     responses:
 *       200:
 *         description: Sharh muvaffaqiyatli qoldirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sharh qoldirildi"
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Buyurtma topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       403:
 *         description: Ruxsat berilmagan (faqat mijoz)
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
router.post(
  "/:id/review",
  roleMiddleware("mijoz"),
  orderController.reviewOrder
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   delete:
 *     summary: Buyurtmani bekor qilish
 *     tags: [Orders]
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
 *               $ref: '#/components/schemas/OrderStatusUpdate'
 *       404:
 *         description: Buyurtma topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Autentifikatsiya xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthError'
 *       403:
 *         description: Ruxsat berilmagan (faqat mijoz)
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
router.delete(
  "/:id/cancel",
  roleMiddleware("mijoz"),
  orderController.cancelOrder
);

module.exports = router;
