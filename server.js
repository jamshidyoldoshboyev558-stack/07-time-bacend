const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mastersRoutes = require('./routes/masters');
const ordersRoutes = require('./routes/order');
const productsRoutes = require('./routes/products');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/masters', mastersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// DB connect & sync (sync xatosini oldini olish)
async function startServer() {
  try {
    // await sequelize.authenticate();
    // console.log('✅ PostgreSQL ga ulandi');
    await sequelize.sync();
    // Sync faqat dev da va xavfsiz
    // Sync xatosini oldini olish - models tozalangach
    //console.log('✅ DB models yuklandi (sync skip)');
    // await sequelize.sync({ force: false }); // keyinroq yoqing
    
    app.listen(PORT, () => {
      console.log(`🚀 07-Time Server: http://localhost:${PORT}`);
      console.log(`📋 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Server/DB xatosi:', error.message);
    console.log('💡 DB setup: CREATE DATABASE time07 + .env yarating');
  }
}

startServer();
