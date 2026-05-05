const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Foydalanuvchi autentifikatsiyasi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi ID
 *         full_name:
 *           type: string
 *           description: Foydalanuvchi to'liq ismi
 *         phone:
 *           type: string
 *           description: Telefon raqami
 *         email:
 *           type: string
 *           format: email
 *           description: Email manzili
 *         role:
 *           type: string
 *           enum: [mijoz, usta, sotuvchi]
 *           description: Foydalanuvchi roli
 *         region:
 *           type: string
 *           description: Hudud
 *         is_verified:
 *           type: boolean
 *           description: Telefon tasdiqlanganmi
 *         is_active:
 *           type: boolean
 *           description: Foydalanuvchi aktivmi
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Yaratilgan vaqti
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yangi foydalanuvchi ro'yxatdan o'tkazish
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Foydalanuvchi to'liq ismi
 *               phone:
 *                 type: string
 *                 description: Telefon raqami
 *               password:
 *                 type: string
 *                 description: Parol
 *               role:
 *                 type: string
 *                 enum: [mijoz, usta, sotuvchi]
 *                 description: Foydalanuvchi roli
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email manzili (ixtiyoriy)
 *               region:
 *                 type: string
 *                 description: Hudud (ixtiyoriy, default: Olmaliq)
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Xato so'rov
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Telefon band
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xato xabari
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xato xabari
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirishi
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Telefon raqami
 *               password:
 *                 type: string
 *                 description: Parol
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirish
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Noto'g'ri telefon/parol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       403:
 *         description: Profil tasdiqlanmagan
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
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xato xabari
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Access token yangilash
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: Token muvaffaqiyatli yangilandi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 *                 accessToken:
 *                   type: string
 *                   description: Yangi JWT access token
 *       401:
 *         description: Yaroqsiz refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xato xabari
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xato xabari
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Foydalanuvchi chiqishi
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (ixtiyoriy)
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli chiqish
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Xato xabari
 *                 message:
 *                   type: string
 *                   description: Xabarnoma
 */
router.post('/logout', logout);

module.exports = router;
