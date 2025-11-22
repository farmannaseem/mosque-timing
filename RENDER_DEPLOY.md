# Deploying to Render

Since Firebase Cloud Functions requires a paid plan, we have moved the backend logic to a standard Node.js server that can be hosted on **Render** (or Railway/Heroku) for free.

## Step 1: Prepare Firebase Admin SDK

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Project settings** > **Service accounts**.
3. Click **Generate new private key**.
4. This will download a JSON file. **Keep this safe and secret!**

## Step 2: Deploy Backend to Render

1. Push your code to **GitHub**.
2. Create an account on [Render](https://render.com/).
3. Click **New +** and select **Web Service**.
4. Connect your GitHub repository.
5. Select the `backend` directory as the **Root Directory**.
6. Set the **Build Command** to: `npm install`
7. Set the **Start Command** to: `node index.js`
8. **Environment Variables**:
   - Scroll down to "Environment Variables".
   - Key: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Open the JSON file you downloaded in Step 1, copy the *entire content*, and paste it here.
   - Key: `PORT` (Optional, Render sets this automatically, usually 10000).
9. Click **Create Web Service**.

## Step 3: Connect App to Backend

1. Once Render finishes deploying, it will give you a URL (e.g., `https://mosque-timing-backend.onrender.com`).
2. Open `d:/mosque-timing-app/config.ts` in your project.
3. Update the `API_URL` with your Render URL:

```typescript
export const API_URL = 'https://mosque-timing-backend.onrender.com';
```

## Step 4: Publish App

Now your app is ready to build!

```bash
eas build --platform android
```
