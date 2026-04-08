const jwt = require('jsonwebtoken');
const { User, UserToken } = require('../models/index');
const crypto = require('crypto');

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token kerak' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    }

    req.user = user;
    req.region = user.region;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Noto\'g\'ri token' });
  }
};

const verifyRefreshMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token kerak' });
    }

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const userToken = await UserToken.findValidRefresh(tokenHash);

    if (!userToken) {
      return res.status(401).json({ error: 'Noto\'g\'ri refresh token' });
    }

    const user = await User.findByPk(userToken.user_id);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    }

    req.userToken = userToken;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Refresh token xatosi' });
  }
};

module.exports = { authMiddleware, verifyRefreshMiddleware };

module.exports = authMiddleware;
