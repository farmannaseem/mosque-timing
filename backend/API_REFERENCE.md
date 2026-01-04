# API Quick Reference

Base URL: `http://localhost:3000` (development) or your deployed URL

## Authentication

All authenticated requests require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register Imam
```http
POST /api/auth/register-imam
Content-Type: application/json

{
  "email": "imam@mosque.com",
  "password": "securepassword123",
  "mosqueName": "Central Mosque",
  "mosqueAddress": "123 Main Street, City",
  "imamName": "Sheikh Ahmed"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "imam@mosque.com",
    "role": "imam"
  },
  "mosque": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Central Mosque",
    "address": "123 Main Street, City",
    "imamName": "Sheikh Ahmed",
    "timings": {
      "fajr": "05:00 AM",
      "dhuhr": "01:00 PM",
      "asr": "04:30 PM",
      "maghrib": "06:00 PM",
      "isha": "08:00 PM",
      "jummah": "01:30 PM"
    }
  }
}
```

### Register User
```http
POST /api/auth/register-user
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "imam@mosque.com",
  "password": "securepassword123"
}
```

## Mosques

### Get All Mosques
```http
GET /api/mosques?search=central&page=1&limit=20
```

**Query Parameters:**
- `search` (optional) - Search by name or address
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 50) - Items per page

### Get Specific Mosque
```http
GET /api/mosques/:id
```

### Update Prayer Timings (Imam Only)
```http
PUT /api/mosques/:id/timings
Authorization: Bearer <token>
Content-Type: application/json

{
  "timings": {
    "fajr": "05:30 AM",
    "dhuhr": "01:15 PM",
    "asr": "04:45 PM",
    "maghrib": "06:15 PM",
    "isha": "08:15 PM",
    "jummah": "01:45 PM"
  }
}
```

**Note:** This automatically sends push notifications to all subscribers!

### Update Mosque Details (Imam Only)
```http
PUT /api/mosques/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Mosque Name",
  "address": "New Address",
  "imamName": "New Imam Name"
}
```

### Deactivate Mosque (Imam Only)
```http
DELETE /api/mosques/:id
Authorization: Bearer <token>
```

## Notifications

### Register Push Token
```http
POST /api/notifications/register-token
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "mosqueId": "507f1f77bcf86cd799439012",
  "platform": "android"
}
```

**Platforms:** `ios`, `android`, `web`

### Unregister Push Token
```http
DELETE /api/notifications/unregister-token
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "mosqueId": "507f1f77bcf86cd799439012"
}
```

### Get Notification Statistics (Imam Only)
```http
GET /api/notifications/stats/:mosqueId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "active": 145,
    "inactive": 5,
    "platforms": {
      "android": 100,
      "ios": 45
    }
  }
}
```

## Health Check

### Check Server Health
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "required": ["imam"],
  "current": "user"
}
```

### 404 Not Found
```json
{
  "error": "Mosque not found"
}
```

### 409 Conflict
```json
{
  "error": "Duplicate Entry",
  "message": "email already exists"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Rate Limits

- **General API:** 100 requests per 15 minutes
- **Auth endpoints:** 5 requests per 15 minutes

## Time Format

All prayer times must be in 12-hour format:
- Format: `HH:MM AM/PM`
- Examples: `05:00 AM`, `01:30 PM`, `11:45 PM`

## Testing with cURL

### Register and Login
```bash
# Register Imam
curl -X POST http://localhost:3000/api/auth/register-imam \
  -H "Content-Type: application/json" \
  -d '{
    "email": "imam@test.com",
    "password": "password123",
    "mosqueName": "Test Mosque",
    "mosqueAddress": "123 Test St",
    "imamName": "Test Imam"
  }'

# Save the token from response
TOKEN="your-token-here"

# Update Timings
curl -X PUT http://localhost:3000/api/mosques/MOSQUE_ID/timings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "timings": {
      "fajr": "05:30 AM",
      "dhuhr": "01:15 PM",
      "asr": "04:45 PM",
      "maghrib": "06:15 PM",
      "isha": "08:15 PM",
      "jummah": "01:45 PM"
    }
  }'
```

## Testing with Postman

1. Import the API endpoints
2. Create an environment with:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set after login)
3. Use `{{base_url}}` and `{{token}}` in requests

## WebSocket Support

Not implemented. All updates are push-based via Expo notifications.

## Pagination

All list endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 100)

Response includes pagination metadata:
```json
{
  "mosques": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

## Search

Text search is available on mosques:
```http
GET /api/mosques?search=central
```

Searches in:
- Mosque name
- Mosque address

## Best Practices

1. **Always use HTTPS in production**
2. **Store JWT tokens securely** (AsyncStorage on mobile)
3. **Handle token expiration** (refresh or re-login)
4. **Validate inputs on client side** before sending
5. **Handle rate limits** gracefully
6. **Use pagination** for large lists
7. **Subscribe to push notifications** after mosque selection

## Common Workflows

### Imam Workflow
1. Register → Get token
2. Update mosque timings → Notifications sent automatically
3. Check notification stats

### User Workflow
1. Register/Login → Get token
2. Browse mosques → Select mosque
3. Register push token → Receive updates

## Support

For issues or questions:
- Check logs: `npm run dev` shows detailed logs
- Review error messages
- Check MongoDB Atlas for data
- See DEPLOYMENT_GUIDE.md for deployment issues
