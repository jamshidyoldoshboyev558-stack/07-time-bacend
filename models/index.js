const sequelize = require('../config/database');
const User = require('./user');
const MasterProfile = require('./masterProfile');
const UserToken = require('./userToken');
const BlacklistToken = require('./blacklistToken');

const models = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  User,
  MasterProfile,
  UserToken,
  BlacklistToken
};

// Associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
