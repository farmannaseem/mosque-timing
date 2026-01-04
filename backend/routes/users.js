const express = require('express');
const { param } = require('express-validator');
const User = require('../models/User');
const Mosque = require('../models/Mosque');
const PushToken = require('../models/PushToken');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/users/follow/:mosqueId
 * @desc    Follow a mosque
 * @access  Private
 */
router.post('/follow/:mosqueId', [
    auth,
    param('mosqueId').isMongoId(),
    validate
], async (req, res, next) => {
    try {
        const { mosqueId } = req.params;

        // Verify mosque exists
        const mosque = await Mosque.findOne({ _id: mosqueId, isActive: true });
        if (!mosque) {
            return res.status(404).json({ error: 'Mosque not found' });
        }

        // Add to user's followed mosques
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $addToSet: { followedMosques: mosqueId } },
            { new: true }
        );

        // Also update any push tokens associated with this user
        await PushToken.updateMany(
            { userId: req.user.userId },
            { $addToSet: { subscriptions: mosqueId } }
        );

        logger.info('User followed mosque', { userId: req.user.userId, mosqueId });

        res.json({
            success: true,
            message: `You are now following ${mosque.name}`,
            followedMosques: user.followedMosques
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/users/unfollow/:mosqueId
 * @desc    Unfollow a mosque
 * @access  Private
 */
router.delete('/unfollow/:mosqueId', [
    auth,
    param('mosqueId').isMongoId(),
    validate
], async (req, res, next) => {
    try {
        const { mosqueId } = req.params;

        // Remove from user's followed mosques
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $pull: { followedMosques: mosqueId } },
            { new: true }
        );

        // Also remove from push tokens
        await PushToken.updateMany(
            { userId: req.user.userId },
            { $pull: { subscriptions: mosqueId } }
        );

        logger.info('User unfollowed mosque', { userId: req.user.userId, mosqueId });

        res.json({
            success: true,
            message: 'Unfollowed successfully',
            followedMosques: user.followedMosques
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/users/feed
 * @desc    Get timings for all followed mosques
 * @access  Private
 */
router.get('/feed', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate({
                path: 'followedMosques',
                match: { isActive: true },
                select: 'name slug address timings updatedAt'
            });

        res.json({
            success: true,
            feed: user.followedMosques
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
