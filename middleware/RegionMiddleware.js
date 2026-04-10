const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

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
     