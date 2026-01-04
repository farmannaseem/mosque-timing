const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Mosque = require('../models/Mosque');
const validate = require('../middleware/validate');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/auth/register-imam
 * @desc    Register a new Imam with mosque
 * @access  Public
 */
router.post('/register-imam', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('mosqueName').trim().notEmpty().isLength({ max: 200 }),
    body('mosqueAddress').trim().notEmpty().isLength({ max: 500 }),
    body('imamName').trim().notEmpty().isLength({ max: 100 }),
    validate
], async (req, res, next) => {
    try {
        const { email, password, mosqueName, mosqueAddress, imamName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role: 'imam'
        });

        // Create mosque
        const mosque = await Mosque.create({
            name: mosqueName,
            address: mosqueAddress,
            imamName,
            imamId: user._id,
            timings: {
                fajr: '05:00 AM',
                dhuhr: '01:00 PM',
                asr: '04:30 PM',
                maghrib: '06:00 PM',
                isha: '08:00 PM',
                jummah: '01:30 PM'
            }
        });

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        logger.info('New imam registered', { email, mosqueId: mosque._id });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            },
            mosque: {
                id: mosque._id,
                name: mosque.name,
                slug: mosque.slug,
                address: mosque.address,
                imamName: mosque.imamName,
                timings: mosque.timings
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
    auth,
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
    validate
], async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const updates = {};

        if (email) updates.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updates,
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user (Imam or regular user)
 * @access  Public
 */
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
], async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        logger.info('User logged in', { email, role: user.role });

        const response = {
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        };

        // If imam, include mosque data
        if (user.role === 'imam') {
            const mosque = await Mosque.findOne({ imamId: user._id, isActive: true });
            if (mosque) {
                response.mosque = {
                    id: mosque._id,
                    name: mosque.name,
                    address: mosque.address,
                    imamName: mosque.imamName,
                    timings: mosque.timings
                };
            }
        }

        res.json(response);

    } catch (error) {
        next(error);
    }
});

/**
 * @route   POST /api/auth/register-user
 * @desc    Register a regular user
 * @access  Public
 */
router.post('/register-user', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    validate
], async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role: 'user'
        });

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        logger.info('New user registered', { email });

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
