const express = require('express');
const { body, param } = require('express-validator');
const PushToken = require('../models/PushToken');
const Mosque = require('../models/Mosque');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/notifications/register-token
 * @desc    Register a push notification token
 * @access  Public (can be used by authenticated or anonymous users)
 */
router.post('/register-token', [
    body('token').notEmpty().withMessage('Token is required'),
    body('mosqueId').optional().isMongoId().withMessage('Valid mosque ID is required'),
    body('platform').optional().isIn(['ios', 'android', 'web']),
    validate
], async (req, res, next) => {
    try {
        const { token, mosqueId, platform = 'android' } = req.body;

        // Verify mosque exists if provided
        if (mosqueId) {
            const mosque = await Mosque.findOne({ _id: mosqueId, isActive: true });
            if (!mosque) {
                return res.status(404).json({ error: 'Mosque not found' });
            }
        }

        // Get userId if authenticated
        const userId = req.user?.userId || null;

        // Register token
        await notificationService.registerToken(token, mosqueId, userId, platform);

        logger.info('Push token registered', { mosqueId, platform });

        res.json({
            success: true,
            message: 'Push token registered successfully'
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/notifications/unregister-token
 * @desc    Unregister a push notification token for a specific mosque
 * @access  Public
 */
router.delete('/unregister-token', [
    body('token').notEmpty(),
    body('mosqueId').isMongoId(),
    validate
], async (req, res, next) => {
    try {
        const { token, mosqueId } = req.body;

        await PushToken.findOneAndUpdate(
            { token },
            { $pull: { subscriptions: mosqueId } }
        );

        logger.info('Push token unregistered', { mosqueId });

        res.json({
            success: true,
            message: 'Push token unregistered successfully'
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/notifications/stats/:mosqueId
 * @desc    Get notification statistics for a mosque (Imam only)
 * @access  Private (Imam)
 */
router.get('/stats/:mosqueId', [
    auth,
    param('mosqueId').isMongoId(),
    validate
], async (req, res, next) => {
    try {
        const { mosqueId } = req.params;

        // Verify mosque ownership
        const mosque = await Mosque.findOne({
            _id: mosqueId,
            imamId: req.user.userId,
            isActive: true
        });

        if (!mosque) {
            return res.status(404).json({
                error: 'Mosque not found or you do not have permission'
            });
        }

        const totalTokens = await PushToken.countDocuments({ subscriptions: mosqueId });
        const activeTokens = await PushToken.countDocuments({ subscriptions: mosqueId, isValid: true });
        const inactiveTokens = await PushToken.countDocuments({ subscriptions: mosqueId, isValid: false });

        const platformBreakdown = await PushToken.aggregate([
            { $match: { mosqueId: mosque._id, isValid: true } },
            { $group: { _id: '$platform', count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            stats: {
                total: totalTokens,
                active: activeTokens,
                inactive: inactiveTokens,
                platforms: platformBreakdown.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {})
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
