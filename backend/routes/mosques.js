const express = require('express');
const { body, param } = require('express-validator');
const Mosque = require('../models/Mosque');
const { auth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/mosques
 * @desc    Get all active mosques
 * @access  Public
 */
router.get('/', async (req, res, next) => {
    try {
        const { search, limit = 50, page = 1 } = req.query;

        const query = { isActive: true };

        // Text search if provided
        if (search) {
            query.$text = { $search: search };
        }

        const mosques = await Mosque.find(query)
            .select('-__v')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Mosque.countDocuments(query);

        res.json({
            success: true,
            mosques,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/mosques/:id
 * @desc    Get a specific mosque by ID
 * @access  Public
 */
router.get('/:id', [
    param('id').isMongoId(),
    validate
], async (req, res, next) => {
    try {
        const mosque = await Mosque.findOne({
            _id: req.params.id,
            isActive: true
        }).select('-__v');

        if (!mosque) {
            return res.status(404).json({ error: 'Mosque not found' });
        }

        res.json({ success: true, mosque });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/mosques/slug/:slug
 * @desc    Get a specific mosque by Slug
 * @access  Public
 */
router.get('/slug/:slug', async (req, res, next) => {
    try {
        const mosque = await Mosque.findOne({
            slug: req.params.slug,
            isActive: true
        }).select('-__v');

        if (!mosque) {
            return res.status(404).json({ error: 'Mosque not found' });
        }

        res.json({ success: true, mosque });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/mosques/:id/timings
 * @desc    Update prayer timings (Imam only)
 * @access  Private (Imam)
 */
router.put('/:id/timings', [
    auth,
    requireRole('imam'),
    param('id').isMongoId(),
    body('timings.fajr').matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/),
    body('timings.dhuhr').matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/),
    body('timings.asr').matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/),
    body('timings.maghrib').matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/),
    body('timings.isha').matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/),
    body('timings.jummah').matches(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/),
    validate
], async (req, res, next) => {
    try {
        const { timings } = req.body;

        // Find mosque and verify ownership
        const mosque = await Mosque.findOne({
            _id: req.params.id,
            imamId: req.user.userId,
            isActive: true
        });

        if (!mosque) {
            return res.status(404).json({
                error: 'Mosque not found or you do not have permission to update it'
            });
        }

        // Update timings
        mosque.timings = timings;
        await mosque.save();

        logger.info('Prayer timings updated', {
            mosqueId: mosque._id,
            mosqueName: mosque.name,
            imamId: req.user.userId
        });

        // Send notifications asynchronously
        // This will now reach all subscribers (anonymous + followers)
        notificationService.sendMosqueUpdate(mosque._id, mosque.name, timings)
            .catch(err => logger.error('Error sending notifications:', err));

        res.json({
            success: true,
            message: 'Timings updated successfully',
            mosque: {
                id: mosque._id,
                name: mosque.name,
                slug: mosque.slug,
                timings: mosque.timings,
                lastUpdated: mosque.updatedAt
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/mosques/:id
 * @desc    Update mosque details (Imam only)
 * @access  Private (Imam)
 */
router.put('/:id', [
    auth,
    requireRole('imam'),
    param('id').isMongoId(),
    body('name').optional().trim().isLength({ max: 200 }),
    body('address').optional().trim().isLength({ max: 500 }),
    body('imamName').optional().trim().isLength({ max: 100 }),
    validate
], async (req, res, next) => {
    try {
        const updates = {};
        const allowedUpdates = ['name', 'address', 'imamName'];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const mosque = await Mosque.findOneAndUpdate(
            {
                _id: req.params.id,
                imamId: req.user.userId,
                isActive: true
            },
            updates,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!mosque) {
            return res.status(404).json({
                error: 'Mosque not found or you do not have permission to update it'
            });
        }

        logger.info('Mosque details updated', { mosqueId: mosque._id });

        res.json({ success: true, mosque });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/mosques/:id
 * @desc    Soft delete mosque (Imam only)
 * @access  Private (Imam)
 */
router.delete('/:id', [
    auth,
    requireRole('imam'),
    param('id').isMongoId(),
    validate
], async (req, res, next) => {
    try {
        const mosque = await Mosque.findOneAndUpdate(
            {
                _id: req.params.id,
                imamId: req.user.userId,
                isActive: true
            },
            { isActive: false },
            { new: true }
        );

        if (!mosque) {
            return res.status(404).json({
                error: 'Mosque not found or you do not have permission to delete it'
            });
        }

        logger.info('Mosque deactivated', { mosqueId: mosque._id });

        res.json({
            success: true,
            message: 'Mosque deactivated successfully'
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
