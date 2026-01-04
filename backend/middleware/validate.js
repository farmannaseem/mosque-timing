const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.warn('Validation failed:', { errors: errors.array(), path: req.path });
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }

    next();
};

module.exports = validate;
