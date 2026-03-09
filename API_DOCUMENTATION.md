# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

---

## Product Endpoints

### Get All Products
```
GET /products?fabric_type=Cotton&price_min=100&price_max=5000&search=silk&page=1&limit=20

Response: 200 OK
{
  "products": [
    {
      "id": "uuid",
      "name": "Premium Cotton Fabric",
      "description": "High quality cotton",
      "price": 299.99,
      "fabric_type": "Cotton",
      "color": "White",
      "stock": 50,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Get Product by ID
```
GET /products/:id

Response: 200 OK
{
  "id": "uuid",
  "name": "Premium Cotton Fabric",
  "description": "High quality cotton",
  "price": 299.99,
  "fabric_type": "Cotton",
  "color": "White",
  "size": "1 meter",
  "pattern": "Plain",
  "stock": 50,
  "discount": 10,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Create Product (Admin Only)
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Cotton Fabric",
  "description": "High quality cotton",
  "price": 299.99,
  "fabric_type": "Cotton",
  "stock": 50
}

Response: 201 Created
{
  "id": "uuid",
  "name": "Premium Cotton Fabric",
  ...
}
```

### Update Product (Admin Only)
```
PUT /products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 349.99,
  "stock": 45
}

Response: 200 OK
{
  "id": "uuid",
  "name": "Premium Cotton Fabric",
  ...
}
```

### Delete Product (Admin Only)
```
DELETE /products/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Product deleted"
}
```

---

## Order Endpoints

### Create Order
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2
    }
  ],
  "address_id": "uuid"
}

Response: 201 Created
{
  "order": {
    "id": "uuid",
    "user_id": "uuid",
    "total_amount": 599.98,
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "razorpayOrder": {
    "id": "order_123456",
    "amount": 59998,
    "currency": "INR"
  },
  "key": "rzp_test_S5nRTleVBjqKri"
}
```

### Verify Payment
```
POST /orders/verify-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "uuid",
  "paymentId": "pay_123456",
  "signature": "signature_hash"
}

Response: 200 OK
{
  "message": "Payment verified",
  "order": {
    "id": "uuid",
    "status": "confirmed",
    "payment_id": "pay_123456"
  }
}
```

### Get User Orders
```
GET /orders
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "total_amount": 599.98,
    "status": "confirmed",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Order Details
```
GET /orders/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "user_id": "uuid",
  "total_amount": 599.98,
  "status": "confirmed",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "quantity": 2,
      "price": 299.99
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Update Order Status (Admin Only)
```
PATCH /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "shipped",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## Admin Endpoints

### Get Dashboard Stats
```
GET /admin/dashboard
Authorization: Bearer <token>

Response: 200 OK
{
  "totalRevenue": 50000,
  "totalOrders": 150,
  "totalCustomers": 500,
  "totalProducts": 200,
  "recentOrders": [...]
}
```

### Get All Orders (Admin)
```
GET /admin/orders
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "total_amount": 599.98,
    "status": "confirmed",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get All Customers (Admin)
```
GET /admin/customers
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Inventory (Admin)
```
GET /admin/inventory
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "Premium Cotton Fabric",
    "stock": 50,
    "price": 299.99
  }
]
```

### Create Admin Account (Super Admin Only)
```
POST /admin/create-admin
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePass123",
  "name": "Admin User"
}

Response: 201 Created
{
  "id": "uuid",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Query Parameters

### Products Endpoint
- `fabric_type` - Filter by fabric type (Cotton, Silk, Linen, Wool)
- `color` - Filter by color
- `price_min` - Minimum price
- `price_max` - Maximum price
- `search` - Search by product name
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Example
```
GET /products?fabric_type=Cotton&price_min=100&price_max=500&page=1&limit=10
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes
- **Headers**: 
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time in seconds

---

## Authentication Flow

1. User registers or logs in
2. Receives JWT token
3. Includes token in Authorization header for protected endpoints
4. Token expires after 7 days
5. User must login again to get new token

---

## Payment Flow

1. Create order with items
2. Receive Razorpay order ID
3. Open Razorpay payment modal
4. Customer completes payment
5. Verify payment signature
6. Update order status to confirmed
7. Send confirmation email

---

## Status Codes

- `200 OK` - Successful GET/PUT/PATCH
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123456",
    "name": "Test User"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products?limit=5
```

### Create Product (with token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test",
    "price": 299.99,
    "fabric_type": "Cotton",
    "stock": 50
  }'
```

---

## Webhook Events (Razorpay)

### Payment Authorized
```json
{
  "event": "payment.authorized",
  "payload": {
    "payment": {
      "id": "pay_123456",
      "amount": 59998,
      "currency": "INR",
      "status": "authorized"
    }
  }
}
```

### Payment Failed
```json
{
  "event": "payment.failed",
  "payload": {
    "payment": {
      "id": "pay_123456",
      "amount": 59998,
      "currency": "INR",
      "status": "failed"
    }
  }
}
```

---

## Best Practices

1. Always include Content-Type header
2. Use HTTPS in production
3. Store tokens securely
4. Validate input on client and server
5. Handle errors gracefully
6. Use pagination for large datasets
7. Implement rate limiting
8. Log all API calls
9. Monitor API performance
10. Keep API documentation updated

---

**API Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅
