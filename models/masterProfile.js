const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// Circular dependency oldini olish - User references keyin
// const { User } = require('./index');

const MasterProfile = sequelize.define('MasterProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
    // references keyinroq index.js da
  },
  specialty: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 50
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0.00,
      max: 10.00
    }
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  portfolio_images: {
    type: DataTypes.JSON, // TEXT[] → JSON array
    defaultValue: []
  },
  bio: {
    type: DataTypes.TEXT
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'master_profiles',
  timestamps: true,
  underscored: true
});

module.exports = MasterProfile;
