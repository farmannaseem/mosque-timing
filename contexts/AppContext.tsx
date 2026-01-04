import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import apiService from '../services/apiService';

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
    imamId: string;
    timings: PrayerTimings;
    lastUpdated: string;
};

type UserRole = 'imam' | 'user' | null;

interface User {
    uid: string;
    email: string;
}

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
    themeMode: 'light' | 'dark';
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [mosques, setMosques] = useState<Mosque[]>([]);
    const [currentMosque, setCurrentMosque] = useState<Mosque | null>(null);
    const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark'); // Default to dark mode for Islamic aesthetic

    // Load data from AsyncStorage on mount
    useEffect(() => {
        loadUserData();
        loadMosquesData();
        loadThemeData();
    }, []);

    // Update current mosque when user or mosques change
    useEffect(() => {
        if (user && mosques.length > 0) {
            const myMosque = mosques.find(m => m.imamId === user.uid);
            if (myMosque) setCurrentMosque(myMosque);
        }
    }, [user, mosques]);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            const role = await AsyncStorage.getItem('userRole');
            if (userData) {
                setUser(JSON.parse(userData));
                setUserRole(role as UserRole);
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    };

    const loadMosquesData = async () => {
        try {
            const mosquesData = await AsyncStorage.getItem('mosques');
            if (mosquesData) {
                setMosques(JSON.parse(mosquesData));
            }
        } catch (e) {
            console.error('Error loading mosques data:', e);
        }
    };

    const loadThemeData = async () => {
        try {
            const storedTheme = await AsyncStorage.getItem('themeMode');
            if (storedTheme === 'dark' || storedTheme === 'light') {
                setThemeMode(storedTheme);
            } else {
                // Default to dark mode for the stunning Islamic aesthetic
                setThemeMode('dark');
                await AsyncStorage.setItem('themeMode', 'dark');
            }
        } catch (e) {
            console.error('Error loading theme data:', e);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = themeMode === 'light' ? 'dark' : 'light';
            setThemeMode(newTheme);
            await AsyncStorage.setItem('themeMode', newTheme);
        } catch (e) {
            console.error('Error saving theme data:', e);
        }
    };

    const saveMosquesData = async (mosquesData: Mosque[]) => {
        try {
            await AsyncStorage.setItem('mosques', JSON.stringify(mosquesData));
            setMosques(mosquesData);
        } catch (e) {
            console.error('Error saving mosques data:', e);
        }
    };

    const registerImam = async (email: string, pass: string, name: string, address: string, imamName: string) => {
        try {
            // Generate a unique ID
            const uid = `imam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const mosqueId = `mosque_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Create user
            const newUser: User = {
                uid,
                email
            };

            // Create mosque
            const newMosque: Mosque = {
                id: mosqueId,
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

            // Save user data
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
            await AsyncStorage.setItem('userRole', 'imam');
            await AsyncStorage.setItem(`user_${email}`, JSON.stringify({ email, pass, uid }));

            // Save mosque data
            const updatedMosques = [...mosques, newMosque];
            await saveMosquesData(updatedMosques);

            // Update state
            setUser(newUser);
            setUserRole('imam');
            setCurrentMosque(newMosque);

        } catch (e: any) {
            console.error("Registration Error: ", e);
            throw new Error(e.message);
        }
    };

    const loginImam = async (email: string, pass: string) => {
        try {
            // Retrieve stored user credentials
            const storedUserData = await AsyncStorage.getItem(`user_${email}`);

            if (!storedUserData) {
                throw new Error('User not found. Please register first.');
            }

            const userData = JSON.parse(storedUserData);

            if (userData.pass !== pass) {
                throw new Error('Invalid password');
            }

            const user: User = {
                uid: userData.uid,
                email: userData.email
            };

            // Save current session
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('userRole', 'imam');

            // Update state
            setUser(user);
            setUserRole('imam');

        } catch (e: any) {
            console.error("Login Error: ", e);
            throw new Error(e.message);
        }
    };

    const updateTimings = async (mosqueId: string, newTimings: PrayerTimings) => {
        try {
            if (!user) throw new Error("Not authenticated");

            // Find and update the mosque
            const updatedMosques = mosques.map(mosque => {
                if (mosque.id === mosqueId && mosque.imamId === user.uid) {
                    return {
                        ...mosque,
                        timings: newTimings,
                        lastUpdated: new Date().toISOString()
                    };
                }
                return mosque;
            });

            // Save updated mosques
            await saveMosquesData(updatedMosques);

            // Update current mosque
            const updatedCurrentMosque = updatedMosques.find(m => m.id === mosqueId);
            if (updatedCurrentMosque) {
                setCurrentMosque(updatedCurrentMosque);
            }

            alert("Timings updated successfully!");

        } catch (e: any) {
            console.error("Error updating timings: ", e);
            alert(e.message);
        }
    };

    const selectMosqueForUser = async (mosqueId: string) => {
        const mosque = mosques.find(m => m.id === mosqueId);
        if (mosque) {
            setSelectedMosque(mosque);
            await AsyncStorage.setItem('selectedMosqueId', mosqueId);
            // Register for Push Notifications
            await registerForPushNotificationsAsync(mosqueId);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userRole');
            setUser(null);
            setUserRole(null);
            setCurrentMosque(null);
        } catch (e) {
            console.error("Logout Error", e);
        }
    };

    const registerForPushNotificationsAsync = async (mosqueId?: string) => {
        if (Platform.OS === 'web') return;

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }

            // Get the token
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: '4508a8de-156a-4623-a1b2-c1d5cd8191d0'
            });
            const token = tokenData.data;

            // Save token locally
            await AsyncStorage.setItem('push_token', token);

            // Send to backend
            // We use the apiService to register the token
            // If mosqueId is provided, we subscribe to that mosque
            // If not, we just register the token (and backend syncs followed mosques)
            const platform = Platform.OS;
            await apiService.registerPushToken(token, mosqueId, platform);

            console.log("Subscribed to notifications with token:", token);
        } catch (e) {
            console.error("Error registering for push notifications:", e);
        }
    };

    // Call this on mount to ensure device is registered
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, [user]); // Re-register when user changes to sync subscriptions

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
            logout,
            themeMode,
            toggleTheme
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
