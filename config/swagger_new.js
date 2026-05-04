const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
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
          bearerFormat: 'JWT'
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
