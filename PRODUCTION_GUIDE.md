# Production Setup Guide

To scale this app for production, we have integrated **Firebase** for real-time database capabilities. This ensures that when an Imam updates timings, all users see it instantly across devices.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup steps.
3. Once created, go to **Project settings** (gear icon > Project settings).
4. Scroll down to **Your apps** and click the **Web** icon (</>).
5. Register the app (e.g., "Mosque Timing App").
6. Copy the `firebaseConfig` object provided.

## Step 2: Configure the App

1. Open `d:/mosque-timing-app/firebaseConfig.ts`.
2. Replace the placeholder values with your actual Firebase configuration from Step 1.

```typescript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mosque-app.firebaseapp.com",
  projectId: "mosque-app",
  storageBucket: "mosque-app.appspot.com",
  messagingSenderId: "12345...",
  appId: "1:12345..."
};
```

## Step 3: Setup Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**.
2. Click **Create Database**.
3. Choose a location (e.g., `nam5 (us-central)`).
4. Start in **Test mode** (for development) or **Production mode** (requires setting up security rules).
   - **Recommended Rules for Production**:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /mosques/{mosqueId} {
           allow read: if true; // Anyone can view timings
           allow write: if true; // Ideally, restrict this to the creator (requires Auth)
         }
       }
     }
     ```

## Step 4: Build for Stores

To publish to Google Play Store or Apple App Store:

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure build: `eas build:configure`
4. Build for Android: `eas build --platform android`
5. Build for iOS: `eas build --platform ios` (Requires Apple Developer Account)

## Next Steps

- **Authentication**: The app is now configured to use Firebase Authentication. Imams must register with an email and password.
- **Push Notifications**: 
  1. Navigate to the `functions` directory: `cd functions`
  2. Install dependencies: `npm install`
  3. Deploy the function: `firebase deploy --only functions`
  4. This will ensure that whenever a mosque document is updated in Firestore, a push notification is sent to all subscribed users via Expo's push service.
