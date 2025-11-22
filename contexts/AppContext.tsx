import * as Notifications from 'expo-notifications';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { API_URL } from '../config';
import { auth, db } from '../firebaseConfig';

// Define types
export type PrayerTimings = {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    jummah: string;
};

export type Mosque = {
    id: string;
    name: string;
    address: string;
    imamName: string;
    imamId: string; // Link to Auth User ID
    timings: PrayerTimings;
    lastUpdated: string;
};

type UserRole = 'imam' | 'user' | null;

interface AppContextType {
    user: User | null;
    userRole: UserRole;
    mosques: Mosque[];
    currentMosque: Mosque | null; // For Imam
    selectedMosque: Mosque | null; // For User
    registerImam: (email: string, pass: string, name: string, address: string, imamName: string) => Promise<void>;
    loginImam: (email: string, pass: string) => Promise<void>;
    updateTimings: (mosqueId: string, newTimings: PrayerTimings) => Promise<void>;
    selectMosqueForUser: (mosqueId: string) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [currentMosque, setCurrentMosque] = useState<Mosque | null>(null);
    const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                setUserRole('imam');
                // Find the mosque belonging to this Imam
                const q = query(collection(db, "mosques")); // In real app, use where("imamId", "==", firebaseUser.uid)
                // Since we don't have composite indexes set up yet, we'll filter client side for this demo or assume we fetch all
                // Ideally: const q = query(collection(db, "mosques"), where("imamId", "==", firebaseUser.uid));
            } else {
                setUserRole(null);
                setCurrentMosque(null);
            }
        });
        return unsubscribe;
    }, []);

    // Real-time listener for Mosques
    useEffect(() => {
        const q = query(collection(db, "mosques"), orderBy("lastUpdated", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const mosquesData: Mosque[] = [];
            querySnapshot.forEach((doc) => {
                mosquesData.push({ id: doc.id, ...doc.data() } as Mosque);
            });
            setMosques(mosquesData);

            // Update current mosque if logged in
            if (user) {
                const myMosque = mosquesData.find(m => m.imamId === user.uid);
                if (myMosque) setCurrentMosque(myMosque);
            }

            // Update selected mosque
            if (selectedMosque) {
                const updatedSelected = mosquesData.find(m => m.id === selectedMosque.id);
                if (updatedSelected) setSelectedMosque(updatedSelected);
            }
        });

        return () => unsubscribe();
    }, [user, selectedMosque?.id]);

    const registerImam = async (email: string, pass: string, name: string, address: string, imamName: string) => {
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const uid = userCredential.user.uid;

            // 2. Create Mosque Document linked to UID
            const newMosqueData = {
                name,
                address,
                imamName,
                imamId: uid,
                timings: {
                    fajr: '05:00 AM',
                    dhuhr: '01:00 PM',
                    asr: '04:30 PM',
                    maghrib: '06:00 PM',
                    isha: '08:00 PM',
                    jummah: '01:30 PM',
                },
                lastUpdated: new Date().toISOString(),
            };

            await addDoc(collection(db, "mosques"), newMosqueData);

            // State updates handled by listeners
        } catch (e: any) {
            console.error("Registration Error: ", e);
            throw new Error(e.message);
        }
    };

    const loginImam = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (e: any) {
            console.error("Login Error: ", e);
            throw new Error(e.message);
        }
    };

    const updateTimings = async (mosqueId: string, newTimings: PrayerTimings) => {
        try {
            if (!user) throw new Error("Not authenticated");
            const token = await user.getIdToken();

            const response = await fetch(`${API_URL}/api/update-timings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mosqueId,
                    timings: newTimings,
                    idToken: token
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update timings");
            }

            alert("Timings updated and users notified!");

        } catch (e: any) {
            console.error("Error updating document: ", e);
            alert(e.message);
        }
    };

    const selectMosqueForUser = async (mosqueId: string) => {
        const mosque = mosques.find(m => m.id === mosqueId);
        if (mosque) {
            setSelectedMosque(mosque);
            // Register for Push Notifications
            await registerForPushNotificationsAsync(mosqueId);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUserRole(null);
            setCurrentMosque(null);
        } catch (e) {
            console.error("Logout Error", e);
        }
    };

    const registerForPushNotificationsAsync = async (mosqueId: string) => {
        if (Platform.OS === 'web') return;

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;

            // Save token to Firestore under the mosque's subcollection
            // mosques/{mosqueId}/tokens/{tokenId}
            const tokenRef = doc(db, "mosques", mosqueId, "tokens", token);
            await setDoc(tokenRef, {
                token: token,
                createdAt: new Date().toISOString()
            });

            console.log("Subscribed to notifications with token:", token);
        } catch (e) {
            console.error("Error registering for push notifications:", e);
        }
    };

    return (
        <AppContext.Provider value={{
            user,
            userRole,
            mosques,
            currentMosque,
            selectedMosque,
            registerImam,
            loginImam,
            updateTimings,
            selectMosqueForUser,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
