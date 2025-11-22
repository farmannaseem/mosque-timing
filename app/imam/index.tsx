import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../contexts/AppContext';

export default function ImamScreen() {
    const { currentMosque, registerImam, logout, user } = useApp();
    const theme = useTheme();
    const router = useRouter();

    // Registration State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [imamName, setImamName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            await registerImam(email, password, name, address, imamName);
            // Success handled by auth listener
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title="Imam Registration" />
                </Appbar.Header>
                <ScrollView contentContainerStyle={styles.container}>
                    <Surface style={styles.formCard}>
                        <Text variant="titleLarge" style={{ marginBottom: 20, textAlign: 'center' }}>Register Your Mosque</Text>

                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            mode="outlined"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry
                        />

                        <View style={styles.divider} />

                        <TextInput
                            label="Mosque Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Address"
                            value={address}
                            onChangeText={setAddress}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Imam Name"
                            value={imamName}
                            onChangeText={setImamName}
                            style={styles.input}
                            mode="outlined"
                        />
                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            style={{ marginTop: 10 }}
                            loading={loading}
                            disabled={loading || !email || !password || !name || !address || !imamName}
                        >
                            Register Mosque
                        </Button>

                        <Button
                            mode="text"
                            onPress={() => router.push('/login')}
                            style={{ marginTop: 10 }}
                        >
                            Already have an account? Login
                        </Button>
                    </Surface>
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (!currentMosque) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading Mosque Data...</Text>
                <Button onPress={logout}>Logout</Button>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.Content title="Imam Dashboard" />
                <Appbar.Action icon="logout" onPress={() => { logout(); router.replace('/'); }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.dashboardContent}>
                <Card style={styles.mosqueCard}>
                    <Card.Content>
                        <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>{currentMosque.name}</Text>
                        <Text variant="bodyMedium" style={{ color: 'gray' }}>{currentMosque.address}</Text>
                        <Text variant="labelLarge" style={{ marginTop: 5 }}>Imam: {currentMosque.imamName}</Text>
                    </Card.Content>
                </Card>

                <Text variant="titleMedium" style={{ marginTop: 20, marginBottom: 10, marginLeft: 5 }}>Current Prayer Timings</Text>

                <Surface style={styles.timingsCard}>
                    {Object.entries(currentMosque.timings).map(([prayer, time]) => (
                        <View key={prayer} style={styles.timingRow}>
                            <Text variant="titleMedium" style={{ textTransform: 'capitalize' }}>{prayer}</Text>
                            <Text variant="headlineSmall" style={{ color: theme.colors.secondary }}>{time}</Text>
                        </View>
                    ))}
                </Surface>

                <Button
                    mode="contained"
                    icon="clock-edit"
                    onPress={() => router.push('/imam/update-timing')}
                    style={styles.updateButton}
                    contentStyle={{ height: 56 }}
                >
                    Update Timings
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
    },
    formCard: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: 'white',
        elevation: 4,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    dashboardContent: {
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
    updateButton: {
        marginTop: 30,
        borderRadius: 12,
    }
});
