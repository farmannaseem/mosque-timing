# Building Android APK - Step by Step Guide

This guide will help you create an Android APK file that you can share with others.

## Prerequisites

✅ EAS CLI is already installed globally
✅ Your app is configured with `eas.json`
✅ Android configuration is set in `app.json`

## Method 1: Build APK with EAS (Recommended - Easiest)

### Step 1: Login to Expo

```bash
eas login
```

If you don't have an Expo account:
1. Go to https://expo.dev/signup
2. Create a free account
3. Then run `eas login` and enter your credentials

### Step 2: Configure the Project (First Time Only)

```bash
eas build:configure
```

This will link your project to your Expo account.

### Step 3: Build the APK

```bash
eas build --platform android --profile preview
```

**What this does:**
- Builds an APK file (not AAB)
- Uses the "preview" profile from `eas.json`
- Creates an installable APK that you can share

**Build Process:**
1. EAS will upload your code to their servers
2. Build will take 5-15 minutes
3. You'll get a download link when it's done
4. Download the APK and share it!

### Step 4: Download and Share

Once the build completes:
1. You'll see a download link in the terminal
2. Click it or go to https://expo.dev/accounts/[your-username]/projects/mosque-timing-app/builds
3. Download the APK file
4. Share it via email, Google Drive, or any file sharing method

## Method 2: Local Build with Expo (Faster but Requires Android Studio)

If you have Android Studio installed, you can build locally:

### Step 1: Prebuild Android Native Code

```bash
npx expo prebuild --platform android
```

### Step 2: Build APK Locally

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Method 3: Development Build (Quick Test)

For quick testing on a physical device:

### Option A: Expo Go App
1. Install "Expo Go" from Google Play Store on your Android device
2. Run `npm start` on your computer
3. Scan the QR code with Expo Go app
4. The app will load on your device

**Note:** This requires your phone and computer to be on the same WiFi network.

### Option B: Development Build APK

```bash
eas build --profile preview --platform android
```

Then install the APK on any Android device.

## Important Notes

### APK vs AAB
- **APK** (Android Package): Can be installed directly on any Android device
- **AAB** (Android App Bundle): Only for Google Play Store

For sharing with someone, use APK (which is what the `preview` profile builds).

### App Permissions

The app requests these permissions:
- **Notifications**: For prayer timing updates
- **Storage**: For local data storage (AsyncStorage)

### Installation on Android Device

When installing the APK:
1. Transfer the APK to the Android device
2. Open the APK file
3. Android will show "Install blocked" - tap "Settings"
4. Enable "Install unknown apps" for your file manager
5. Go back and tap "Install"

### Signing the APK

EAS automatically handles signing for you. If you're building locally, you'll need to:
1. Generate a keystore
2. Configure signing in `android/app/build.gradle`

## Troubleshooting

### Build Failed
- Check your internet connection
- Make sure you're logged in: `eas whoami`
- Try again: `eas build --platform android --profile preview --clear-cache`

### APK Won't Install
- Make sure "Install from unknown sources" is enabled
- Check if you have enough storage space
- Try uninstalling any previous version first

### App Crashes on Startup
- Make sure all dependencies are installed: `npm install`
- Check if the build completed successfully
- Review build logs at https://expo.dev

## Next Steps After Building

1. **Test the APK** on your own device first
2. **Share the APK** via:
   - Google Drive
   - Email
   - WhatsApp
   - Direct file transfer
3. **Publish to Play Store** (optional):
   - Build with production profile: `eas build --platform android --profile production`
   - This creates an AAB file
   - Upload to Google Play Console

## Quick Reference Commands

```bash
# Login to Expo
eas login

# Build APK for sharing
eas build --platform android --profile preview

# Check build status
eas build:list

# View build logs
eas build:view [build-id]

# Start development server
npm start
```

## Estimated Times

- **EAS Build**: 5-15 minutes
- **Local Build**: 2-5 minutes (requires Android Studio)
- **Development with Expo Go**: Instant

## Cost

- **EAS Build**: Free tier includes limited builds per month
- **Local Build**: Completely free
- **Expo Go**: Free

---

**Ready to build?** Run this command:

```bash
eas build --platform android --profile preview
```

Good luck! 🚀
