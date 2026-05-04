const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '07-Time API',
      version: '1.0.0',
      description: 'Olmaliq hududida mijozlar, ustalar va sotuvchilarni birlashtiruvchi onlayn platforma',
      contact: {
        name: 'API Support',
        email: 'support@07time.uz'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.07time.uz',
        description: 'Production server'
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
        User: {
          type: 'object',
          required: ['full_name', 'phone', 'password', 'role'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Foydalanuvchi ID'
            },
            full_name: {
              type: 'string',
              maxLength: 100,
              description: 'Foydalanuvchi to\'liq ismi'
            },
            phone: {
              type: 'string',
              maxLength: 20,
              description: 'Telefon raqami'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email manzili'
            },
            role: {
              type: 'string',
              enum: ['mijoz', 'usta', 'sotuvchi'],
              description: 'Foydalanuvchi roli'
            },
            region: {
              type: 'string',
              maxLength: 100,
              description: 'Hudud'
            },
            is_verified: {
              type: 'boolean',
              description: 'Telefon tasdiqlanganmi'
            },
            is_active: {
              type: 'boolean',
              description: 'Foydalanuvchi aktivmi'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yaratilgan vaqti'
            }
          }
        },
        Order: {
          type: 'object',
          required: ['client_id', 'description'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Buyurtma ID'
            },
            client_id: {
              type: 'string',
              format: 'uuid',
              description: 'Mijoz ID'
            },
            master_id: {
              type: 'string',
              format: 'uuid',
              description: 'Usta ID'
            },
            description: {
              type: 'string',
              description: 'Buyurtma tavsifi'
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'in_progress', 'done', 'cancelled', 'paid', 'refunded'],
              description: 'Buyurtma statusi'
            },
            region: {
              type: 'string',
              description: 'Hudud'
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Narxi'
            },
            commission_rate: {
              type: 'number',
              format: 'decimal',
              description: 'Komissiya foizi'
            },
            commission_amount: {
              type: 'number',
              format: 'decimal',
              description: 'Komissiya miqdori'
            },
            proof_images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Ish bajarilganligi isboti rasmlari'
            },
            completed_at: {
              type: 'string',
              format: 'date-time',
              description: 'Tugatilgan vaqti'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yaratilgan vaqti'
            }
          }
        },
        Payment: {
          type: 'object',
          required: ['order_id', 'user_id', 'amount', 'method'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Tolov ID'
            },
            order_id: {
              type: 'string',
              format: 'uuid',
              description: 'Buyurtma ID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'Foydalanuvchi ID'
            },
            amount: {
              type: 'number',
              format: 'decimal',
              description: 'Tolov summasi'
            },
            commission_amount: {
              type: 'number',
              format: 'decimal',
              description: 'Komissiya miqdori'
            },
            net_amount: {
              type: 'number',
              format: 'decimal',
              description: 'Toza summa'
            },
            method: {
              type: 'string',
              enum: ['cash', 'click', 'payme', 'uzum', 'bank_card'],
              description: 'Tolov usuli'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
              description: 'Tolov statusi'
            },
            transaction_id: {
              type: 'string',
              description: 'Tranzaksiya ID'
            },
            external_payment_id: {
              type: 'string',
              description: 'Tashqi tolov ID'
            },
            payment_date: {
              type: 'string',
              format: 'date-time',
              description: 'Tolov sanasi'
            },
            refund_date: {
              type: 'string',
              format: 'date-time',
              description: 'Qaytarish sanasi'
            },
            refund_reason: {
              type: 'string',
              description: 'Qaytarish sababi'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yaratilgan vaqti'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yangilangan vaqti'
            }
          }
        },
        MasterProfile: {
          type: 'object',
          required: ['user_id', 'specialty'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Usta profili ID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'Foydalanuvchi ID'
            },
            specialty: {
              type: 'string',
              maxLength: 150,
              description: 'Mutaxassislik'
            },
            experience_years: {
              type: 'integer',
              minimum: 0,
              maximum: 50,
              description: 'Tajriba yillari'
            },
            rating: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              maximum: 10,
              description: 'Reyting'
            },
            total_reviews: {
              type: 'integer',
              description: 'Jami sharhlar soni'
            },
            portfolio_images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Portfolio rasmlari'
            },
            bio: {
              type: 'string',
              description: 'Biografiya'
            },
            is_available: {
              type: 'boolean',
              description: 'Mavjudligi'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yaratilgan vaqti'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yangilangan vaqti'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['seller_id', 'name', 'price', 'delivery_region'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Mahsulot ID'
            },
            seller_id: {
              type: 'string',
              format: 'uuid',
              description: 'Sotuvchi ID'
            },
            name: {
              type: 'string',
              description: 'Mahsulot nomi'
            },
            description: {
              type: 'string',
              description: 'Mahsulot tavsifi'
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Narxi'
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Mahsulot rasmlari'
            },
            stock_quantity: {
              type: 'integer',
              description: 'Ombordagi miqdori'
            },
            is_available: {
              type: 'boolean',
              description: 'Mavjudligi'
            },
            delivery_region: {
              type: 'string',
              description: 'Yetkazish hududi'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yaratilgan vaqti'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Yangilangan vaqti'
            }
          }
        },
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
        }
      }
    }
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
