const sequelize = require('../config/database');
const User = require('./user');
const MasterProfile = require('./masterProfile');
const UserToken = require('./userToken');
const BlacklistToken = require('./blacklistToken');
const Order = require('./order');
const Payment = require('./payment');

/**
 * @swagger
 * components:
 *   schemas:
 *     DatabaseModels:
 *       type: object
 *       description: Ma'lumotlar bazasi modellari to'plami
 *       properties:
 *         sequelize:
 *           type: object
 *           description: Sequelize ulanish obyekti
 *         Sequelize:
 *           type: object
 *           description: Sequelize kutubxonasi
 *         User:
 *           $ref: '#/components/schemas/User'
 *         MasterProfile:
 *           $ref: '#/components/schemas/MasterProfile'
 *         UserToken:
 *           $ref: '#/components/schemas/UserToken'
 *         BlacklistToken:
 *           $ref: '#/components/schemas/BlacklistToken'
 *         Order:
 *           $ref: '#/components/schemas/Order'
 *         Payment:
 *           $ref: '#/components/schemas/Payment'
 *     ModelAssociations:
 *       type: object
 *       description: Modellar o'rtasidagi aloqalar
 *       properties:
 *         User-MasterProfile:
 *           type: string
 *           description: User (1) -> MasterProfile (1)
 *         User-UserToken:
 *           type: string
 *           description: User (1) -> UserToken (many)
 *         User-BlacklistToken:
 *           type: string
 *           description: User (1) -> BlacklistToken (many)
 *         User-Order:
 *           type: string
 *           description: User (many) -> Order (many)
 *         Order-Payment:
 *           type: string
 *           description: Order (1) -> Payment (many)
 */

const models = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  User,
  MasterProfile,
  UserToken,
  BlacklistToken,
  Order,
  Payment
};


Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
