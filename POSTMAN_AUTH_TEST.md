# 07-Time Auth API Test (Postman)

## 1. Server ishlayotganini tekshiring
```
GET http://localhost:5000/health
Expected: {"status":"OK"}
```

## 2. User Register (Yangi mijoz)
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "full_name": "Ahmad Mijoz",
  "phone": "998901234567", 
  "email": "ahmad@test.uz",
  "password": "mijoz123",
  "role": "mijoz",
  "region": "Olmaliq"
}
```
**Expected (201):**
```json
{
  "message": "Foydalanuvchi yaratildi...",
  "user": { "phone": "998901234567", "role": "mijoz" },
  "token": "eyJ..."
}
```

## 3. Usta Register
```
POST /api/auth/register
{
  "full_name": "Ustaxon Usta", 
  "phone": "998901234568",
  "password": "usta123",
  "role": "usta"
}
```

## 4. Login Test (now returns accessToken + refreshToken)
```
POST http://localhost:5000/api/auth/login
{
  "phone": "998901234567",
  "password": "mijoz123"
}
```
**Expected (200):**
```json
{
  "message": "Muvaffaqiyatli kirish",
  "user": {...},
  "accessToken": "eyJ...",
  "refreshToken": "long_hex...",
  "expiresAt": "2024-..."
}
```

## 5. Refresh Token
```
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json
{
  "refreshToken": "from_login_refreshToken"
}
```
**Expected (200):**
```json
{
  "message": "Token yangilandi",
  "accessToken": "new_access"
}
```

## 6. Logout
```
POST http://localhost:5000/api/auth/logout
{
  "refreshToken": "same_refresh"
}
```
**Expected (200):**
```json
{
  "message": "Muvaffaqiyatli chiqish"
}
```
(Refresh token invalidates)

## 7. Xato Tests
- POST /login unverified → 403
- POST /refresh invalid → 401
- POST /logout no token → 200 (ok)

## 🔧 Setup
```
npm run dev
```
Test with Postman or curl. Frontend: store access localStorage, refresh secure cookie.
