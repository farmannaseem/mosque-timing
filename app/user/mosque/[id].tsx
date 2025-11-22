import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Surface, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../../contexts/AppContext';

export default function MosqueDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { mosques } = useApp();
    const theme = useTheme();
    const router = useRouter();

    const mosque = mosques.find(m => m.id === id);

    if (!mosque) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Mosque not found</Text>
                <Button onPress={() => router.back()}>Go Back</Button>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={mosque.name} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.content}>
                <Card style={styles.mosqueCard}>
                    <Card.Content>
                        <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>{mosque.name}</Text>
                        <Text variant="bodyMedium" style={{ color: 'gray' }}>{mosque.address}</Text>
                        <Text variant="labelLarge" style={{ marginTop: 5 }}>Imam: {mosque.imamName}</Text>
                        <Text variant="labelSmall" style={{ marginTop: 10, color: theme.colors.secondary }}>
                            Last Updated: {new Date(mosque.lastUpdated).toLocaleString()}
                        </Text>
                    </Card.Content>
                </Card>

                <Text variant="titleMedium" style={{ marginTop: 20, marginBottom: 10, marginLeft: 5 }}>Prayer Timings</Text>

                <Surface style={styles.timingsCard}>
                    {Object.entries(mosque.timings).map(([prayer, time]) => (
                        <View key={prayer} style={styles.timingRow}>
                            <Text variant="titleMedium" style={{ textTransform: 'capitalize' }}>{prayer}</Text>
                            <Text variant="headlineSmall" style={{ color: theme.colors.secondary }}>{time}</Text>
                        </View>
                    ))}
                </Surface>

                <View style={styles.infoBox}>
                    <Text variant="bodySmall" style={{ textAlign: 'center', color: 'gray' }}>
                        You will receive notifications when timings are updated for this mosque.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    mosqueCard: {
        marginBottom: 20,
        backgroundColor: 'white',
    },
    timingsCard: {
        padding: 15,
        borderRadius: 16,
        backgroundColor: 'white',
        elevation: 2,
    },
    timingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoBox: {
        marginTop: 30,
        padding: 10,
    }
});
