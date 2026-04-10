const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = require("./UserModels")(sequelize, DataTypes);
const Product = require("./ProductModels")(sequelize, DataTypes);
const Order = require("./OrderModels")(sequelize, DataTypes);
const Master = require("./MasterModels")(sequelize, DataTypes);

User.hasMany(Product, { foreignKey: "seller_id" });
Product.belongsTo(User, { foreignKey: "seller_id", as: "seller" });

User.hasOne(Master, { foreignKey: "user_id" });
Master.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Order, { foreignKey: "client_id", as: "clientOrders" });
Order.belongsTo(User, { foreignKey: "client_id", as: "client" });

Master.hasMany(Order, { foreignKey: "master_id" });
Order.belongsTo(Master, { foreignKey: "master_id" });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Master
};