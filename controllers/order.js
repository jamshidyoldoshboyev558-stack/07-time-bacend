const { DataTypes } = require("sequelize");
const Order = require("../models/order");

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
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - description
 *       properties:
 *         description:
 *           type: string
 *           description: Buyurtma tavsifi
 *           example: "Kompyuter ta'mirlash kerak"
 *         region:
 *           type: string
 *           description: Buyurtma hududi
 *           example: "Olmaliq"
 *         price:
 *           type: number
 *           format: decimal
 *           description: Buyurtma narxi (ixtiyoriy)
 *           example: 150000.00
 *     OrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Buyurtma yaratildi"
 *         order:
 *           $ref: '#/components/schemas/Order'
 */

const STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in_progress",
    DONE: "done",
    CANCELLED: "cancelled"
};

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
 *         description: Xato so'rov
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
exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create({
            ...req.body,
            client_id: req.user.id
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        // UUID formatini tekshirish
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ error: "Noto'g'ri ID format" });
        }
        
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

        res.json(order)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.acceptedOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        // UUID formatini tekshirish
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ error: "Noto'g'ri ID format" });
        }
        
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

        if (order.status !== STATUS.PENDING) {
            return res.status(400).json({ message: "Buyurtma allaqachon qabul qilingan" });
        }

        order.status = STATUS.ACCEPTED;
        order.master_id = req.user.id;

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.completeOrder = async (req, res) => {
    try {
        const { id } = req.params;
        
        // UUID formatini tekshirish
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ error: "Noto'g'ri ID format" });
        }
        
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

        if (
            order.status !== STATUS.ACCEPTED && 
            order.status !== STATUS.IN_PROGRESS
        ) {
            return res.status(400).json({ message: "Buyurtmani tugatib bo'lmaydi" });
        }

        order.status = STATUS.DONE;
        order.proof_images = req.body.proof_images;
        order.completed_at = new Date();

        if (order.price && order.commission_rate) {
            order.commission_amount = 
            (order.price * order.commission_rate) / 100;
        }

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.reviewOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // UUID formatini tekshirish
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: "Noto'g'ri ID format" });
    }
    
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

    order.rating = req.body.rating;

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // UUID formatini tekshirish
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: "Noto'g'ri ID format" });
    }
    
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Buyurtma topilmadi" });

    if (order.status === STATUS.DONE) {
      return res.status(400).json({ message: "Tugatilgan buyurtmani bekor qilib bo'lmaydi" });
    }

    order.status = STATUS.CANCELLED;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};