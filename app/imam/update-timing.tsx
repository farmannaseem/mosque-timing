import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicBackground } from '../../components/IslamicBackground';
import { PrayerTimings, useApp } from '../../contexts/AppContext';

export default function UpdateTimingScreen() {
    const { currentMosque, updateTimings } = useApp();
    const theme = useTheme();
    const router = useRouter();
    const isDark = theme.dark;

    const [timings, setTimings] = useState<PrayerTimings>(
        currentMosque?.timings || {
            fajr: '',
            dhuhr: '',
            asr: '',
            maghrib: '',
            isha: '',
            jummah: '',
        }
    );

    const handleUpdate = (prayer: keyof PrayerTimings, time: string) => {
        setTimings(prev => ({ ...prev, [prayer]: time }));
    };

    const saveTimings = () => {
        if (currentMosque) {
            updateTimings(currentMosque.id, timings);
            router.back();
        }
    };

    return (
        <IslamicBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                    <Appbar.BackAction onPress={() => router.back()} color={isDark ? '#FFD700' : '#1A2F42'} />
                    <Appbar.Content title="Update Prayer Timings" titleStyle={{ color: isDark ? '#FFD700' : '#1A2F42', fontWeight: 'bold' }} />
                </Appbar.Header>

                <ScrollView contentContainerStyle={styles.container}>
                    <Text variant="bodyMedium" style={{ marginBottom: 24, color: isDark ? '#E2E8F0' : '#64748B', textAlign: 'center' }}>
                        Enter the new prayer times below. Changes will be notified to all followers immediately.
                    </Text>

                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <LinearGradient
                            colors={isDark ? ['rgba(26, 47, 66, 0.9)', 'rgba(13, 31, 45, 0.95)'] : ['#FFFFFF', '#F8FAFC']}
                            style={[styles.formCard, !isDark && styles.cardShadow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            {Object.keys(timings).map((prayer, index) => (
                                <View key={prayer} style={styles.inputContainer}>
                                    <TextInput
                                        label={prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                                        value={timings[prayer as keyof PrayerTimings]}
                                        onChangeText={(text) => handleUpdate(prayer as keyof PrayerTimings, text)}
                                        mode="outlined"
                                        style={styles.input}
                                        placeholder="e.g. 05:30 AM"
                                        theme={{ colors: { primary: isDark ? '#FFD700' : '#1A2F42', background: isDark ? '#0F172A' : '#FFFFFF' } }}
                                        textColor={isDark ? '#FFFFFF' : '#000000'}
                                    />
                                </View>
                            ))}

                            <Button
                                mode="contained"
                                onPress={saveTimings}
                                style={styles.saveButton}
                                contentStyle={{ height: 56 }}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold', color: '#0A1929' }}
                            >
                                Save & Notify Users
                            </Button>
                        </LinearGradient>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </IslamicBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    formCard: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'transparent',
    },
    saveButton: {
        marginTop: 24,
        borderRadius: 16,
        backgroundColor: '#FFD700',
        elevation: 4,
    }
});

