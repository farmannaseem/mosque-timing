# Mosque Timing App - Backend API

Production-ready backend server for the Mosque Timing App with MongoDB, JWT authentication, and push notifications.

## Features

- ✅ **MongoDB Atlas** - Persistent database storage
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Role-Based Access Control** - Imam vs User permissions
- ✅ **Push Notifications** - Expo push with ticket/receipt handling
- ✅ **Security Middleware** - Helmet, CORS, rate limiting
- ✅ **Input Validation** - Express-validator
- ✅ **Logging** - Winston logger
- ✅ **Error Handling** - Centralized error management
- ✅ **Docker Support** - Containerized deployment
- ✅ **Automated Tests** - Jest test suite

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register-imam` - Register new imam with mosque
- `POST /api/auth/register-user` - Register regular user
- `POST /api/auth/login` - Login

### Mosques

- `GET /api/mosques` - Get all mosques
- `GET /api/mosques/:id` - Get specific mosque
- `PUT /api/mosques/:id/timings` - Update timings (Imam only)
- `PUT /api/mosques/:id` - Update mosque details (Imam only)
- `DELETE /api/mosques/:id` - Deactivate mosque (Imam only)

### Notifications

- `POST /api/notifications/register-token` - Register push token
- `DELETE /api/notifications/unregister-token` - Unregister token
- `GET /api/notifications/stats/:mosqueId` - Get notification stats (Imam only)

### Health

- `GET /health` - Health check endpoint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `ALLOWED_ORIGINS` | CORS allowed origins | http://localhost:8081 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `LOG_LEVEL` | Logging level | info |

## Docker Deployment

### Using Docker Compose (Recommended for Development)

```bash
docker-compose up -d
```

### Using Docker

```bash
# Build
docker build -t mosque-timing-backend .

# Run
docker run -p 3000:3000 --env-file .env mosque-timing-backend
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Validates all inputs
- **NoSQL Injection Prevention** - Sanitizes MongoDB queries
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds

## Monitoring & Logging

- **Winston** - Structured logging
- **Request Logging** - All API requests logged
- **Error Tracking** - Centralized error handling
- **Health Checks** - `/health` endpoint for monitoring

## Production Deployment

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

### Deployment Platforms

#### Render.com

1. Create new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

#### Railway.app

1. Create new project
2. Connect repository
3. Add environment variables
4. Deploy

#### Heroku

```bash
heroku create mosque-timing-api
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## Maintenance

### Cleanup Jobs

The server automatically runs cleanup jobs:
- Invalid push tokens are removed every 24 hours
- Tokens are marked invalid after delivery failures

### Database Indexes

Indexes are automatically created for:
- User emails (unique)
- Mosque imam IDs
- Push tokens
- Text search on mosque names/addresses

## License

MIT
