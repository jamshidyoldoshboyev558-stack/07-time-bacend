/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - seller_id
 *         - name
 *         - price
 *         - delivery_region
 *       properties:
 *         id:
 *           type: integer
 *           description: Mahsulot unikal ID si
 *           example: 1
 *         seller_id:
 *           type: integer
 *           description: Sotuvchi ID si
 *           example: 1
 *         name:
 *           type: string
 *           description: Mahsulot nomi
 *           example: "Laptop Dell Inspiron"
 *         description:
 *           type: string
 *           description: Mahsulot tavsifi
 *           example: "Yuqori sifatli laptop, 16GB RAM, 512GB SSD"
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
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Yaratilgan vaqti
 *           example: "2025-01-01T10:00:00Z"
 */
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    images: DataTypes.ARRAY(DataTypes.TEXT),
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    delivery_region: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  });
};

