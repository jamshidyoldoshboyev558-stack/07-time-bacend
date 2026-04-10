const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "testdb",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "1234",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 30000,
    dialect: "postgres",

    logging: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(" Database ulandi");
  } catch (error) {
    console.error(" Database xato:", error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB
};