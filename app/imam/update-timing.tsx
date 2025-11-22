import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrayerTimings, useApp } from '../../contexts/AppContext';

export default function UpdateTimingScreen() {
    const { currentMosque, updateTimings } = useApp();
    const theme = useTheme();
    const router = useRouter();

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
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Update Prayer Timings" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>
                <Text variant="bodyMedium" style={{ marginBottom: 20, color: 'gray', textAlign: 'center' }}>
                    Enter the new prayer times below. Changes will be notified to all followers immediately.
                </Text>

                {Object.keys(timings).map((prayer) => (
                    <View key={prayer} style={styles.inputContainer}>
                        <TextInput
                            label={prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                            value={timings[prayer as keyof PrayerTimings]}
                            onChangeText={(text) => handleUpdate(prayer as keyof PrayerTimings, text)}
                            mode="outlined"
                            style={styles.input}
                            placeholder="e.g. 05:30 AM"
                        />
                    </View>
                ))}

                <Button
                    mode="contained"
                    onPress={saveTimings}
                    style={styles.saveButton}
                    contentStyle={{ height: 56 }}
                >
                    Save & Notify Users
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        backgroundColor: 'white',
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 12,
    }
});
