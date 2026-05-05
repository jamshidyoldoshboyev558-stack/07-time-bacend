const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const mastersRoutes = require('./routes/masters');
const ordersRoutes = require('./routes/order');
const productsRoutes = require('./routes/products');
const paymentRoutes = require('./routes/payment');
const sequelize = require('./config/database');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger konfiguratsiyasi
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '07-Time API',
      version: '1.0.0',
      description: 'Olmaliq hududida mijozlar, ustalar va sotuvchilarni birlashtiruvchi onlayn platforma'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token ni "Bearer <token>" formatida kiriting'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Xato xabari'
            },
            message: {
              type: 'string',
              description: 'Xabarnoma'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Muvaffaqiyat xabari'
            },
            data: {
              type: 'object',
              description: 'Ma\'lumotlar'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Xabarnoma'
            },
            user: {
              type: 'object',
              description: 'Foydalanuvchi ma\'lumotlari'
            },
            accessToken: {
              type: 'string',
              description: 'JWT access token'
            },
            refreshToken: {
              type: 'string',
              description: 'Refresh token'
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              description: 'Token muddati'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['phone', 'password'],
          properties: {
            phone: {
              type: 'string',
              description: 'Telefon raqami'
            },
            password: {
              type: 'string',
              description: 'Parol'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['full_name', 'phone', 'password', 'role'],
          properties: {
            full_name: {
              type: 'string',
              description: 'Foydalanuvchi to\'liq ismi'
            },
            phone: {
              type: 'string',
              description: 'Telefon raqami'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email manzili (ixtiyoriy)'
            },
            password: {
              type: 'string',
              description: 'Parol'
            },
            role: {
              type: 'string',
              enum: ['mijoz', 'usta', 'sotuvchi'],
              description: 'Foydalanuvchi roli'
            },
            region: {
              type: 'string',
              description: 'Hudud (ixtiyoriy, default: Olmaliq)'
            }
          }
        },
        RefreshRequest: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              description: 'Refresh token'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));


app.use('/api/auth', authRoutes);
app.use('/api/masters', mastersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/payments', paymentRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '07-Time API is running!',
    docs: `http://localhost:${PORT}/api-docs`,
    health: `http://localhost:${PORT}/health`
  });
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(` 07-Time Server: http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
});
