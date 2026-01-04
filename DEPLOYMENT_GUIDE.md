# Production Deployment Guide

This guide covers deploying the Mosque Timing App backend to production.

## Table of Contents

1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Platforms](#deployment-platforms)
4. [Post-Deployment](#post-deployment)
5. [Monitoring](#monitoring)

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project (e.g., "Mosque Timing App")

### 2. Create a Cluster

1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to your users)
4. Name your cluster (e.g., "mosque-timing-cluster")
5. Click "Create Cluster"

### 3. Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 4. Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to your server IPs
4. Click "Confirm"

### 5. Get Connection String

1. Go to **Database** in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `mosque-timing`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/mosque-timing?retryWrites=true&w=majority
```

## Environment Configuration

### Generate JWT Secret

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Environment Variables

Create a `.env` file with these variables:

```env
NODE_ENV=production
PORT=3000

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mosque-timing?retryWrites=true&w=majority

# JWT Secret (use generated secret above)
JWT_SECRET=your-generated-secret-here

# JWT Expiration
JWT_EXPIRES_IN=7d

# Expo Access Token (optional, for better rate limits)
EXPO_ACCESS_TOKEN=your-expo-token

# CORS - Add your frontend URLs
ALLOWED_ORIGINS=https://your-app.com,exp://your-expo-app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Sentry (optional)
SENTRY_DSN=your-sentry-dsn
```

## Deployment Platforms

### Option 1: Render.com (Recommended)

#### Advantages
- Free tier available
- Easy setup
- Auto-deploys from Git
- Built-in SSL

#### Steps

1. **Create Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Select the `backend` directory

3. **Configure Service**
   ```
   Name: mosque-timing-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   - Click "Environment" tab
   - Add all variables from `.env`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your service URL (e.g., `https://mosque-timing-api.onrender.com`)

### Option 2: Railway.app

#### Advantages
- Very simple setup
- Free tier with $5 credit/month
- Automatic HTTPS

#### Steps

1. **Create Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Node.js
   - Add environment variables in Settings
   - Set root directory to `backend`

4. **Deploy**
   - Deployment starts automatically
   - Get your URL from Settings → Domains

### Option 3: Heroku

#### Steps

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   cd backend
   heroku create mosque-timing-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set NODE_ENV=production
   # ... add all other variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

#### Steps

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create new App
3. Connect GitHub repository
4. Configure:
   - Type: Web Service
   - Source Directory: `backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Add environment variables
6. Deploy

### Option 5: Docker on VPS

If you have a VPS (DigitalOcean, Linode, AWS EC2, etc.):

1. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd mosque-timing-app/backend
   ```

3. **Create .env file**
   ```bash
   nano .env
   # Add your environment variables
   ```

4. **Build and Run**
   ```bash
   docker build -t mosque-timing-backend .
   docker run -d -p 3000:3000 --env-file .env --name mosque-api mosque-timing-backend
   ```

5. **Setup Nginx Reverse Proxy** (optional but recommended)
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment

### 1. Test the API

```bash
# Health check
curl https://your-api-url.com/health

# Get mosques
curl https://your-api-url.com/api/mosques
```

### 2. Update Frontend Config

Update `config.ts` in your React Native app:

```typescript
export const API_URL = 'https://your-api-url.com';
```

### 3. Test Authentication

Use Postman or curl to test:

```bash
# Register Imam
curl -X POST https://your-api-url.com/api/auth/register-imam \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "mosqueName": "Test Mosque",
    "mosqueAddress": "123 Test St",
    "imamName": "Test Imam"
  }'
```

### 4. Setup Custom Domain (Optional)

Most platforms support custom domains:
- Render: Settings → Custom Domains
- Railway: Settings → Domains
- Heroku: Settings → Domains

## Monitoring

### 1. Health Checks

Set up monitoring to ping `/health` endpoint every 5 minutes:
- [UptimeRobot](https://uptimerobot.com) (Free)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

### 2. Error Tracking (Optional)

Setup [Sentry](https://sentry.io):

1. Create Sentry account
2. Create new project (Node.js)
3. Get DSN
4. Add to environment variables:
   ```env
   SENTRY_DSN=your-sentry-dsn
   ```

### 3. Logging

Check logs on your platform:
- Render: Logs tab
- Railway: Deployments → View Logs
- Heroku: `heroku logs --tail`

### 4. Database Monitoring

MongoDB Atlas provides:
- Real-time metrics
- Query performance insights
- Alerts for issues

Access via Atlas dashboard → Metrics tab

## Scaling

### Horizontal Scaling

Most platforms support auto-scaling:
- Render: Settings → Scaling
- Railway: Automatically scales
- Heroku: `heroku ps:scale web=2`

### Database Scaling

MongoDB Atlas:
- Upgrade to M10+ for auto-scaling
- Enable sharding for large datasets
- Add read replicas for high traffic

## Security Checklist

- ✅ Use HTTPS (automatic on most platforms)
- ✅ Set strong JWT_SECRET
- ✅ Restrict MongoDB network access
- ✅ Enable rate limiting
- ✅ Use environment variables (never commit secrets)
- ✅ Keep dependencies updated
- ✅ Monitor for security vulnerabilities
- ✅ Setup CORS properly
- ✅ Use helmet.js (already configured)

## Backup Strategy

### Database Backups

MongoDB Atlas (M10+):
- Automatic continuous backups
- Point-in-time recovery
- Manual snapshots

Free tier (M0):
- Use `mongodump` for manual backups
- Schedule with cron job

### Code Backups

- Use Git (already done)
- Tag releases: `git tag v1.0.0`
- Keep production branch protected

## Troubleshooting

### Common Issues

1. **Cannot connect to MongoDB**
   - Check connection string
   - Verify network access (IP whitelist)
   - Check database user credentials

2. **Authentication fails**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure password is hashed correctly

3. **CORS errors**
   - Add frontend URL to ALLOWED_ORIGINS
   - Check protocol (http vs https)

4. **Rate limit errors**
   - Adjust RATE_LIMIT_MAX_REQUESTS
   - Implement user-specific rate limits

### Getting Help

- Check logs first
- Review MongoDB Atlas metrics
- Test endpoints with Postman
- Check GitHub Issues

## Cost Estimation

### Free Tier (Good for MVP)
- MongoDB Atlas M0: Free
- Render Free: Free (sleeps after inactivity)
- Railway: $5/month credit
- **Total: $0-5/month**

### Production (Recommended)
- MongoDB Atlas M10: $57/month
- Render Standard: $7/month
- Domain: $12/year
- **Total: ~$65/month**

### High Traffic
- MongoDB Atlas M30: $200/month
- Render Pro: $25/month
- CDN: $20/month
- **Total: ~$245/month**

## Next Steps

1. Deploy to staging environment first
2. Test thoroughly
3. Deploy to production
4. Monitor for 24 hours
5. Setup alerts
6. Document any issues
7. Create runbook for common tasks

## Support

For issues:
1. Check logs
2. Review this guide
3. Check MongoDB Atlas status
4. Contact platform support
5. Open GitHub issue
