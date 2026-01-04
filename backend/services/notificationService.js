const { Expo } = require('expo-server-sdk');
const PushToken = require('../models/PushToken');
const logger = require('./logger');

const expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN
});

class NotificationService {
    /**
     * Send push notifications to all subscribers of a mosque
     */
    /**
     * Send push notifications to all subscribers of a mosque
     */
    async sendMosqueUpdate(mosqueId, mosqueName, timings) {
        try {
            // Get all valid tokens for this mosque
            // Now querying the subscriptions array
            const tokenDocs = await PushToken.find({
                subscriptions: mosqueId,
                isValid: true
            }).select('token platform');

            if (tokenDocs.length === 0) {
                logger.info('No subscribers found for mosque', { mosqueId });
                return { success: true, sent: 0 };
            }

            const tokens = tokenDocs.map(doc => doc.token);
            logger.info(`Sending notifications to ${tokens.length} subscribers`, { mosqueId });

            // Create messages
            const messages = [];
            for (const token of tokens) {
                if (!Expo.isExpoPushToken(token)) {
                    logger.warn('Invalid Expo push token', { token });
                    await this.markTokenInvalid(token);
                    continue;
                }

                messages.push({
                    to: token,
                    sound: 'default',
                    title: 'Prayer Timings Updated! 🕌',
                    body: `Assalamualaikum! The prayer timings for ${mosqueName} have been updated.`,
                    data: {
                        mosqueId: mosqueId.toString(),
                        timings,
                        type: 'timing_update'
                    },
                    priority: 'high',
                    channelId: 'prayer-timings'
                });
            }

            // Send in chunks
            const chunks = expo.chunkPushNotifications(messages);
            const tickets = [];

            for (const chunk of chunks) {
                try {
                    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    logger.error('Error sending notification chunk:', error);
                }
            }

            // Process tickets to identify failed tokens
            await this.processTickets(tickets, tokens);

            // Schedule receipt checking after 15 minutes
            setTimeout(() => {
                this.checkReceipts(tickets);
            }, 15 * 60 * 1000);

            return {
                success: true,
                sent: messages.length,
                tickets: tickets.length
            };

        } catch (error) {
            logger.error('Error in sendMosqueUpdate:', error);
            throw error;
        }
    }

    /**
     * Process push notification tickets
     */
    async processTickets(tickets, tokens) {
        for (let i = 0; i < tickets.length; i++) {
            const ticket = tickets[i];
            const token = tokens[i];

            if (ticket.status === 'error') {
                logger.error('Push notification error:', {
                    token,
                    error: ticket.message,
                    details: ticket.details
                });

                // Mark token as invalid if it's a device error
                if (ticket.details?.error === 'DeviceNotRegistered') {
                    await this.markTokenInvalid(token);
                }
            }
        }
    }

    /**
     * Check receipts for sent notifications
     */
    async checkReceipts(tickets) {
        try {
            const receiptIds = tickets
                .filter(ticket => ticket.status === 'ok' && ticket.id)
                .map(ticket => ticket.id);

            if (receiptIds.length === 0) return;

            const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

            for (const chunk of receiptIdChunks) {
                try {
                    const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

                    for (const receiptId in receipts) {
                        const receipt = receipts[receiptId];

                        if (receipt.status === 'error') {
                            logger.error('Push notification receipt error:', {
                                receiptId,
                                error: receipt.message,
                                details: receipt.details
                            });

                            // Handle specific errors
                            if (receipt.details?.error === 'DeviceNotRegistered') {
                                // Token is no longer valid, we should remove it
                                // Note: We don't have the token here, so we'll rely on ticket processing
                                logger.warn('Device not registered for receipt:', receiptId);
                            }
                        }
                    }
                } catch (error) {
                    logger.error('Error fetching receipts:', error);
                }
            }
        } catch (error) {
            logger.error('Error in checkReceipts:', error);
        }
    }

    /**
     * Mark a push token as invalid
     */
    async markTokenInvalid(token) {
        try {
            const result = await PushToken.findOneAndUpdate(
                { token },
                {
                    isValid: false,
                    $inc: { failureCount: 1 }
                },
                { new: true }
            );

            if (result) {
                logger.info('Marked token as invalid', { token: token.substring(0, 20) + '...' });
            }
        } catch (error) {
            logger.error('Error marking token invalid:', error);
        }
    }

    /**
     * Register or update a push token
     */
    /**
     * Register or update a push token
     */
    async registerToken(token, mosqueId = null, userId = null, platform = 'android') {
        try {
            if (!Expo.isExpoPushToken(token)) {
                throw new Error('Invalid Expo push token format');
            }

            // Get user's followed mosques if authenticated
            let userSubscriptions = [];
            if (userId) {
                const User = require('../models/User');
                const user = await User.findById(userId).select('followedMosques');
                if (user && user.followedMosques) {
                    userSubscriptions = user.followedMosques.map(id => id.toString());
                }
            }

            // Find existing token
            let tokenDoc = await PushToken.findOne({ token });

            if (tokenDoc) {
                // Update existing token
                tokenDoc.isValid = true;
                tokenDoc.lastUsed = new Date();
                tokenDoc.failureCount = 0;
                if (userId) tokenDoc.userId = userId;

                // Merge subscriptions
                const currentSubs = new Set(tokenDoc.subscriptions.map(s => s.toString()));
                if (mosqueId) currentSubs.add(mosqueId.toString());
                userSubscriptions.forEach(id => currentSubs.add(id));

                tokenDoc.subscriptions = Array.from(currentSubs);

                await tokenDoc.save();
                logger.info('Updated existing push token', { mosqueId, userId });
                return tokenDoc;
            } else {
                // Create new token
                const initialSubs = new Set();
                if (mosqueId) initialSubs.add(mosqueId.toString());
                userSubscriptions.forEach(id => initialSubs.add(id));

                const newToken = await PushToken.create({
                    token,
                    subscriptions: Array.from(initialSubs),
                    userId,
                    platform,
                    isValid: true,
                    lastUsed: new Date()
                });

                logger.info('Registered new push token', { mosqueId, userId });
                return newToken;
            }
        } catch (error) {
            logger.error('Error registering token:', error);
            throw error;
        }
    }

    /**
     * Remove invalid tokens (cleanup job)
     */
    async cleanupInvalidTokens() {
        try {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

            const result = await PushToken.deleteMany({
                isValid: false,
                updatedAt: { $lt: thirtyDaysAgo }
            });

            logger.info(`Cleaned up ${result.deletedCount} invalid tokens`);
            return result.deletedCount;
        } catch (error) {
            logger.error('Error cleaning up tokens:', error);
            throw error;
        }
    }
}

module.exports = new NotificationService();
