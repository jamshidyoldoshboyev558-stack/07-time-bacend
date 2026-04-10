require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize, connectDB } = require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const masterRoutes = require("./routes/MasterRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const productRoutes = require("./routes/ProductRoutes");

app.use("/api", masterRoutes);
app.use("/api", orderRoutes);
app.use("/api", productRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(); 
    await sequelize.sync({ alter: true });

    console.log(" Database tayyor");

    app.listen(PORT, () => {
      console.log(` Server ${PORT} portda ishladi`);
    });

  } catch (err) {
    console.error(" Xato:", err);
  }
};

start();