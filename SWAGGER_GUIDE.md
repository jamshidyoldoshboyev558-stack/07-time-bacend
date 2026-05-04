# 07-Time API Swagger Dokumentatsiyasi

## Swagger nima?

Swagger - bu API larni hujjatlashtirish va test qilish uchun ishlatiladigan ochiq standart. U API larni avtomatik ravishda hujjatlashtirib, interaktiv interfeys taqdim etadi.

##  Swagger ni ishga tushirish

1. **Serverni ishga tushiring:**
   ```bash
   npm run dev
   ```

2. **Swagger UI ni oching:**
   - Brauzeringizda `http://localhost:5000/api-docs` manzilini oching

##  API larni hujjatlashtirish

Swagger kommentariyalari quyidagi formatda yoziladi:

### 1. Route larda kommentariyalar

```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirishi
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirish
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
```

### 2. Schema larni aniqlash

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - full_name
 *         - phone
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Foydalanuvchi ID
 *         full_name:
 *           type: string
 *           description: Foydalanuvchi to'liq ismi
 */
```

##  Authentication

Swagger da JWT token bilan autentifikatsiya:

1. **Authorize tugmasini bosing**
2. **Bearer token kiriting:** `Bearer <your_jwt_token>`
3. **Lock tugmasini bosing** - Endi barcha himoyalangan API larni test qilishingiz mumkin

##  Mavjud API lar

### Authentication
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `POST /api/auth/refresh` - Token yangilash
- `POST /api/auth/logout` - Chiqish

### Payments
- `POST /api/payments/create` - Tolov yaratish
- `POST /api/payments/process` - Tolovni qayta ishlash
- `GET /api/payments/status/:payment_id` - Tolov statusi
- `GET /api/payments/history` - Tolov tarixi
- `POST /api/payments/:payment_id/refund` - Tolovni qaytarish
- `GET /api/payments/stats` - Statistika (admin)
- `GET /api/payments/pending` - Kutilayotgan tolovlar (admin)

### Orders
- `POST /api/orders` - Buyurtma yaratish
- `GET /api/orders/:id` - Buyurtma ma'lumotlari
- `PUT /api/orders/:id/accept` - Buyurtmani qabul qilish
- `PUT /api/orders/:id/complete` - Buyurtmani tugatish
- `POST /api/orders/:id/review` - Sharh qoldirish
- `DELETE /api/orders/:id/cancel` - Buyurtmani bekor qilish

### Masters
- `GET /api/masters` - Ustalar ro'yxati
- `GET /api/masters/:id` - Usta ma'lumotlari
- `POST /api/masters/portfolio` - Portfolio rasm qo'shish
- `GET /api/masters/orders` - Usta buyurtmalari

### Products
- `POST /api/products` - Mahsulot yaratish
- `GET /api/products/:id` - Mahsulot ma'lumotlari
- `GET /api/products/search` - Mahsulot qidirish
- `PUT /api/products/:id` - Mahsulot yangilash
- `DELETE /api/products/:id` - Mahsulot o'chirish

##  Test qilish

Swagger UI da API larni to'g'ridan-to'g'ri test qilishingiz mumkin:

1. **Kerakli API ni tanlang**
2. **"Try it out" tugmasini bosing**
3. **Parametrlarni to'ldiring**
4. **"Execute" tugmasini bosing**
5. **Natijalarni ko'ring**

##  Konfiguratsiya

Swagger konfiguratsiyasi `config/swagger.js` faylida joylashgan:

```javascript
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
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};
```

##  Yangi API larni qo'shish

Yangi API qo'shganda:

1. **Route faylida Swagger kommentariyari qo'shing**
2. **Schema larni aniqlang**
3. **Security qo'llang (agar kerak bo'lsa)**
4. **Response larni hujjatlashtiring**

##  Best Practices

1. **Aniq tavsiflar** - Har bir endpoint uchun aniq tavsif yozing
2. **To'liq schema** - Barcha maydonlarni tavsiflang
3. **Error handling** - Barcha xatolik holatlarini hujjatlashtiring
4. **Security** - Himoyalangan API lar uchun security qo'llang
5. **Examples** - Misollar bilan yordam bering

##  Debug

Swagger ishlamayotgan bo'lsa:

1. **Server ishlayotganini tekshiring**
2. **Paketlar o'rnatilganini tekshiring:**
   ```bash
   npm list swagger-jsdoc swagger-ui-express
   ```
3. **Route larni tekshiring** - Swagger kommentariyalari to'g'ri yozilganmi
4. **Console log larni tekshiring** - Xatoliklar bo'lishi mumkin






