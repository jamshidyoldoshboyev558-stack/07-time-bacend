const express = require("express");
const app = express();
const productRoutes = require("./routes/products");
const masterRoutes = require("./routes/masters");
const { sequelize } = require("./models");

app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/masters", masterRoutes);

app.listen(5000, async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ PostgreSQL ga ulandi");
        await sequelize.sync();
        console.log("✅ DB models yuklandi (sync skip)");
        console.log("🚀 07-Time Server: http://localhost:5000");
        console.log("📋 Health: http://localhost:5000/health");
    } catch (error) {
        console.error("❌ Server/DB xatosi:", error.message);
        console.log("💡 DB setup: CREATE DATABASE time07 + .env yarating");
    }
});
console.log("Iltimos, server.js faylidan foydalaning!");