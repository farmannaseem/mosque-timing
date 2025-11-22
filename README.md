# Mosque Timing App

A premium Expo (React Native) app for managing and viewing mosque prayer timings.

## Features

### For Imams
- **Register Mosque**: Create a profile for your mosque.
- **Dashboard**: View current timings and mosque details.
- **Update Timings**: Easily update prayer times.
- **Instant Notifications**: Updates trigger notifications to users.

### For Users
- **Find a Mosque**: Search for mosques by name or location.
- **View Timings**: See accurate, up-to-date prayer times.
- **Notifications**: Receive alerts when your selected mosque updates timings.

## Tech Stack
- **Framework**: Expo (React Native)
- **Routing**: Expo Router
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **Persistence**: AsyncStorage
- **Notifications**: Expo Notifications

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npx expo start
   ```
   - Press `a` for Android emulator.
   - Press `w` for Web (limited functionality for notifications).
   - Scan QR code with Expo Go on your phone.

## Note
- This is a demo application.
- Notifications are simulated locally for demonstration purposes.
- Data is persisted locally on the device.
