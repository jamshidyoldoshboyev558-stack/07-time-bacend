const { Product } = require('../models');
const { DataTypes, Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Mahsulotlar boshqaruvi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - delivery_region
 *       properties:
 *         name:
 *           type: string
 *           description: Mahsulot nomi
 *           example: "Laptop Dell Inspiron"
 *         description:
 *           type: string
 *           description: Mahsulot tavsifi
 *           example: "Yuqori sifatli laptop"
 *         price:
 *           type: number
 *           format: float
 *           description: Mahsulot narxi
 *           example: 2500000.00
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Mahsulot rasmlari
 *           example: ["image1.jpg", "image2.jpg"]
 *         stock_quantity:
 *           type: integer
 *           description: Ombordagi miqdori
 *           example: 10
 *           default: 0
 *         is_available:
 *           type: boolean
 *           description: Mahsulot mavjudligi
 *           example: true
 *           default: true
 *         delivery_region:
 *           type: string
 *           description: Yetkazish hududi
 *           example: "Olmaliq"
 *     ProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Mahsulot yaratildi"
 *         product:
 *           $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yangi mahsulot yaratish
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Mahsulot muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
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
exports.createProduct = async (req, res) => {
 try{
  const { seller_id, name, description, price, images, stock_quantity, is_available, delivery_region } = req.body;

  const newProduct = await Product.create({
    seller_id,
    name,
    description,
    price,
    images,
    stock_quantity,
    is_available,
    delivery_region
  });

  res.status(201).json(newProduct);

 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};


exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getByNameQuery = async (req, res) => {
  try {
    const { name } = req.query;

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getByNameParam = async (req, res) => {
  try {
    const name = req.params.name;

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, images, stock_quantity, is_available, delivery_region } = req.body;

    const [updatedCount, updatedRows] = await Product.update(
      {
        name,
        description,
        price,
        images,
        stock_quantity,
        is_available,
        delivery_region
      },
      {
        where: { id },
        returning: true
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Topilmadi" });
    }

    res.json(updatedRows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Topilmadi" });
    }

    await product.destroy();
    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};