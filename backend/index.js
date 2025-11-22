const express = require('express');
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase Admin
// In production (Render), we will use environment variables
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const expo = new Expo();

// API Endpoint to Update Timings
app.post('/api/update-timings', async (req, res) => {
    try {
        const { mosqueId, timings, idToken } = req.body;

        if (!mosqueId || !timings || !idToken) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify the user is authenticated
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Get the mosque to verify ownership
        const mosqueRef = db.collection('mosques').doc(mosqueId);
        const mosqueDoc = await mosqueRef.get();

        if (!mosqueDoc.exists) {
            return res.status(404).json({ error: 'Mosque not found' });
        }

        const mosqueData = mosqueDoc.data();

        // Verify that the requester is the owner of the mosque
        if (mosqueData.imamId !== uid) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this mosque' });
        }

        // Update Firestore
        await mosqueRef.update({
            timings: timings,
            lastUpdated: new Date().toISOString()
        });

        // Send Notifications
        await sendNotifications(mosqueId, mosqueData.name);

        res.status(200).json({ success: true, message: 'Timings updated and notifications sent' });

    } catch (error) {
        console.error('Error updating timings:', error);
        res.status(500).json({ error: error.message });
    }
});

async function sendNotifications(mosqueId, mosqueName) {
    const tokensSnapshot = await db.collection(`mosques/${mosqueId}/tokens`).get();

    if (tokensSnapshot.empty) {
        console.log('No tokens found for mosque:', mosqueId);
        return;
    }

    let messages = [];
    tokensSnapshot.forEach((doc) => {
        const token = doc.data().token;
        if (Expo.isExpoPushToken(token)) {
            messages.push({
                to: token,
                sound: 'default',
                title: 'Prayer Timings Updated! 🕌',
                body: `Assalamualaikum! The prayer timings for ${mosqueName} have been updated.`,
                data: { mosqueId: mosqueId },
            });
        }
    });

    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
            console.error(error);
        }
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
