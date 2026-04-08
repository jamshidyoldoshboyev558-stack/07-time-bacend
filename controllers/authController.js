const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, UserToken } = require('../models/index');
const { Op } = require('sequelize');

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await UserToken.create({
    user_id: user.id,
    token: refreshTokenHash,
    expires_at: expiresAt,
    type: 'refresh'
  });

  return { accessToken, refreshToken, expiresAt };
};

const register = async (req, res) => {
  try {
    const { full_name, phone, email, password, role, region } = req.body;

    if (!phone || !password || !role) {
      return res.status(400).json({ error: 'Asosiy maydonlar kerak' });
    }

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({ error: 'Telefon band' });
    }

    const user = await User.create({
      full_name,
      phone,
      email,
      password_hash: password,
      role,
      region: region || 'Olmaliq',
      is_verified: true
    });

    // Short access only for unverified
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(201).json({
      message: 'Foydalanuvchi yaratildi. Telefon tasdiqlang.',
      user: {
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        region: user.region
      },
      accessToken
    });

  } catch (error) {
    console.error('Register xatosi:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ where: { phone } });
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ error: 'Noto\'g\'ri telefon/parol' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ error: 'Profil tasdiqlanmagan' });
    }

    const { accessToken, refreshToken, expiresAt } = await generateTokens(user);

    res.json({
      message: 'Muvaffaqiyatli kirish',
      user: {
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role,
        region: user.region
      },
      accessToken,
      refreshToken,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Login xatosi:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token kerak' });
    }

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const userToken = await UserToken.findValidRefresh(req.user?.id || null, tokenHash); // or from all

    if (!userToken) {
      return res.status(401).json({ error: 'Noto\'g\'ri refresh token' });
    }

    const user = await User.findByPk(userToken.user_id);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    }

    const { accessToken: newAccessToken } = await generateTokens(user);
    // Don't generate new refresh, just return new access

    res.json({
      message: 'Token yangilandi',
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh xatosi:', error);
    res.status(401).json({ error: 'Token xatosi' });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'];

    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await UserToken.update(
        { is_valid: false },
        { where: { token: tokenHash } }
      );
    }

    res.json({ message: 'Muvaffaqiyatli chiqish' });

  } catch (error) {
    console.error('Logout xatosi:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
};

module.exports = { register, login, refresh, logout };
