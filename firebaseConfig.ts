import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
    apiKey: "AIzaSyB73V5wY4MRW6rO2_F0iUAMMgkwh3jlwBI",
    authDomain: "mosque-timing-be385.firebaseapp.com",
    projectId: "mosque-timing-be385",
    storageBucket: "mosque-timing-be385.firebasestorage.app",
    messagingSenderId: "37214021060",
    appId: "1:37214021060:web:d10edee890faf8076e7091",
    measurementId: "G-961JT17CN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
