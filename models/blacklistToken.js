const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlacklistToken = sequelize.define('BlacklistToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'blacklist_tokens',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['token']
    },
    {
      fields: ['expires_at']
    }
  ]
});

// Cleanup expired tokens (cron later)
BlacklistToken.cleanup = async () => {
  await BlacklistToken.destroy({
    where: { expires_at: { [Op.lt]: new Date() } }
  });
};

module.exports = BlacklistToken;

