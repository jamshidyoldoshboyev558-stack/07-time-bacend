const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

/**
 * @swagger
 * tags:
 *   name: Middleware
 *   description: Hududga asoslangan autentifikatsiya middleware lari
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegionAuth:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operatsiya muvaffaqiyati
 *           example: false
 *         message:
 *           type: string
 *           description: Xato xabari
 *           example: "Token mavjud emas"
 *     RegionContext:
 *       type: object
 *       properties:
 *         region:
 *           type: string
 *           description: Foydalanuvchi hududi
 *           example: "Olmaliq"
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/*:
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - in: header
 *       name: x-region
 *       required: true
 *       schema:
 *         type: string
 *       description: Hudud ma'lumoti
 *       example: "Olmaliq"
 *   description: Barcha hududga asoslangan endpoint lar
 */

const authRegionMiddleware = (requiredRole = null) => {
  return async (req, res, next) => {
    try {

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Token mavjud emas" });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }

      const region = req.headers['x-region'] || req.body.region;
      if (!region) {
        return res.status(400).json({ success: false, message: "Region topilmadi" });
      }

    
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ success: false, message: "Ruxsat yo‘q" });
      }

      req.region = region;

      next();
    } catch (error) {
      console.error("AuthRegion Middleware Xato:", error);
      return res.status(500).json({ success: false, message: "Server xatosi" });
    }
  };
};

module.exports = authRegionMiddleware;
     