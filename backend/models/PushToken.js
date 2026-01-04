const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mosque'
    }],
    platform: {
        type: String,
        enum: ['ios', 'android', 'web'],
        default: 'android'
    },
    isValid: {
        type: Boolean,
        default: true
    },
    lastUsed: {
        type: Date,
        default: Date.now
    },
    failureCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
pushTokenSchema.index({ subscriptions: 1, isValid: 1 });
pushTokenSchema.index({ token: 1 }, { unique: true });

// Auto-delete invalid tokens after 30 days
pushTokenSchema.index({ updatedAt: 1 }, {
    expireAfterSeconds: 2592000,
    partialFilterExpression: { isValid: false }
});

module.exports = mongoose.model('PushToken', pushTokenSchema);
