# Mosque Timing App

A premium, production-ready mobile application built with Expo and React Native that simplifies prayer timing management for Imams and provides real-time updates for communities.

## 🌟 New in v2.0 Overhaul

- **Premium UI Redesign**: Completely revamped interface with modern aesthetics, glassmorphism, rich gradients, and smooth animations.
- **Islamic Art Integration**: Authentic experience with subtle Arabic calligraphy and geometric patterns.
- **Robust Backend**: Switched to a robust Node.js/Express + MongoDB backend (replacing simple implementations).
- **Smart Notifications**: Intelligent push notification system that alerts users only when their followed mosque updates timings.
- **Mosque Following System**: Users can now search for and "follow" specific mosques to personalize their dashboard.


## ✨ Features

- **For Communities (Users)**
  - 🎨 **Beautiful Dashboard**: View prayer times in a visually stunning interface.
  - 🔔 **Real-time Alerts**: Get notified immediately when an Imam changes the time.
  - 🕌 **Follow Mosques**: personalized feed of the mosques you care about.
  - 🧭 **Qibla Direction**: (Planned feature)
  
- **For Imams**
  - ⚡ **Quick Updates**: Update prayer times in seconds.
  - 📊 **Broadcast**: Instant notification dispatch to all followers.
  - 🔒 **Secure Portal**: Protected authentication and mosque management.

## 🛠 Tech Stack

- **Frontend**: React Native, Expo, TypeScript, Expo Router
- **UI/UX**: Custom Design System, React Native Paper, Linear Gradients, Lottie Animations
- **Backend**: Node.js, Express, MongoDB
- **Notifications**: Expo Push Notifications Service
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farmannaseem/mosque-timing.git
   cd mosque-timing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the App**
   ```bash
   npx expo start
   ```

## 🏗 Building for Production

To build the standalone android application (APK/AAB):

```bash
eas build --platform android
```

## 📂 Project Structure

```
mosque-timing-app/
├── app/                    # Screens & Navigation (Expo Router)
├── backend/                # Production Backend API
├── components/             # Reusable UI Components
├── constants/              # Design Tokens & Config
├── contexts/               # Global State (Auth, App Data)
└── assets/                 # Images & Animations
```

## 📄 License

MIT
