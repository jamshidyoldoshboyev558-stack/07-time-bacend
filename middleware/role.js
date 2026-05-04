/**
 * @swagger
 * tags:
 *   name: Middleware
 *   description: Rolga asoslangan ruxsat middleware lari
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleAuth:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Xato xabari
 *           example: "Forbidden"
 *     RoleValidation:
 *       type: object
 *       properties:
 *         allowed_roles:
 *           type: array
 *           items:
 *             type: string
 *           enum: [mijoz, usta, sotuvchi]
 *           description: Ruxsat etilgan rollar
 *           example: ["mijoz", "usta"]
 *         user_role:
 *           type: string
 *           enum: [mijoz, usta, sotuvchi]
 *           description: Foydalanuvchi roli
 *           example: "mijoz"
 */

/**
 * @swagger
 * /api/*:
 *   security:
 *     - bearerAuth: []
 *   description: Barcha rolga asoslangan endpoint lar
 */

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};