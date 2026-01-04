require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./utils/database');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const notificationService = require('./services/notificationService');

// Import routes
const authRoutes = require('./routes/auth');
const mosqueRoutes = require('./routes/mosques');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');

const app = express();

// ...

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mosques', mosqueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Mosque Timing API',
        version: '2.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            mosques: '/api/mosques',
            notifications: '/api/notifications'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Cleanup job - runs every 24 hours
setInterval(() => {
    logger.info('Running cleanup job for invalid tokens');
    notificationService.cleanupInvalidTokens()
        .catch(err => logger.error('Cleanup job failed:', err));
}, 24 * 60 * 60 * 1000);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});

module.exports = app;
