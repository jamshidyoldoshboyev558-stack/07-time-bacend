const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { Op } = sequelize;

const UserToken = sequelize.define('UserToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('refresh'),
    defaultValue: 'refresh',
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'user_tokens',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'type'] },
    { fields: ['token'], unique: true },
    { fields: ['expires_at'] }
  ]
});

// Cleanup expired/invalid
UserToken.cleanup = async () => {
  await UserToken.destroy({
    where: {
      [Op.or]: [
        { expires_at: { [Op.lt]: new Date() } },
        { is_valid: false }
      ]
    }
  });
};

// Find valid refresh for user
UserToken.findValidRefresh = async (tokenHash) => {
  const { Op } = require('../config/database').sequelize;
  return await UserToken.findOne({
    where: {
      token: tokenHash,
      is_valid: true,
      expires_at: { [Op.gt]: new Date() }
    }
  });
};

module.exports = UserToken;

