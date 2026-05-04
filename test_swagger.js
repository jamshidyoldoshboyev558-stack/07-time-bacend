const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Swagger konfiguratsiyasi
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '07-Time API Test',
      version: '1.0.0',
      description: 'Test API documentation'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ]
  },
  apis: []
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Swagger test is working!' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});
