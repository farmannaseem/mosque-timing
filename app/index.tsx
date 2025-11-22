import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen() {
    const router = useRouter();
    const theme = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold', textAlign: 'center' }}>
                        Mosque Timing App
                    </Text>
                    <Text variant="bodyLarge" style={{ textAlign: 'center', marginTop: 10, color: theme.colors.secondary }}>
                        Accurate Prayer Times, Directly from Your Mosque
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Surface style={styles.card} elevation={2}>
                        <Text variant="titleMedium" style={{ marginBottom: 10, color: theme.colors.onSurface }}>For Imams</Text>
                        <Text variant="bodyMedium" style={{ marginBottom: 20, color: 'gray' }}>
                            Manage your mosque's prayer timings and notify your community instantly.
                        </Text>
                        <Button
                            mode="contained"
                            onPress={() => router.push('/imam')}
                            style={styles.button}
                            contentStyle={{ height: 50 }}
                        >
                            Imam Login / Register
                        </Button>
                    </Surface>

                    <Surface style={styles.card} elevation={2}>
                        <Text variant="titleMedium" style={{ marginBottom: 10, color: theme.colors.onSurface }}>For Users</Text>
                        <Text variant="bodyMedium" style={{ marginBottom: 20, color: 'gray' }}>
                            Find your local mosque and get real-time prayer updates.
                        </Text>
                        <Button
                            mode="outlined"
                            onPress={() => router.push('/user')}
                            style={styles.button}
                            contentStyle={{ height: 50 }}
                        >
                            Find a Mosque
                        </Button>
                    </Surface>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    actions: {
        gap: 20,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'white',
    },
    button: {
        borderRadius: 8,
    }
});
