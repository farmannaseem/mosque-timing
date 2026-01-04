import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicBackground } from '../../components/IslamicBackground';
import { useApp } from '../../contexts/AppContext';

export default function ImamScreen() {
    const { currentMosque, registerImam, logout, user } = useApp();
    const theme = useTheme();
    const router = useRouter();
    const isDark = theme.dark;

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
            <IslamicBackground>
                <SafeAreaView style={{ flex: 1 }}>
                    <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                        <Appbar.BackAction onPress={() => router.back()} color={isDark ? '#FFD700' : '#1A2F42'} />
                        <Appbar.Content title="Imam Registration" titleStyle={{ color: isDark ? '#FFD700' : '#1A2F42', fontWeight: 'bold' }} />
                    </Appbar.Header>
                    <ScrollView contentContainerStyle={styles.container}>
                        <Animated.View entering={FadeInDown.delay(300).springify()}>
                            <LinearGradient
                                colors={isDark ? ['rgba(26, 47, 66, 0.9)', 'rgba(13, 31, 45, 0.95)'] : ['#FFFFFF', '#F8FAFC']}
                                style={[styles.formCard, !isDark && styles.cardShadow]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text variant="titleLarge" style={{ marginBottom: 24, textAlign: 'center', color: isDark ? '#FFD700' : '#1A2F42', fontWeight: 'bold' }}>
                                    Register Your Mosque
                                </Text>

                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    mode="outlined"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    theme={{ colors: { primary: isDark ? '#FFD700' : '#1A2F42', background: isDark ? '#0F172A' : '#FFFFFF' } }}
                                    textColor={isDark ? '#FFFFFF' : '#000000'}
                                />
                                <TextInput
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    mode="outlined"
                                    secureTextEntry
                                    theme={{ colors: { primary: isDark ? '#FFD700' : '#1A2F42', background: isDark ? '#0F172A' : '#FFFFFF' } }}
                                    textColor={isDark ? '#FFFFFF' : '#000000'}
                                />

                                <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />

                                <TextInput
                                    label="Mosque Name"
                                    value={name}
                                    onChangeText={setName}
                                    style={styles.input}
                                    mode="outlined"
                                    theme={{ colors: { primary: isDark ? '#FFD700' : '#1A2F42', background: isDark ? '#0F172A' : '#FFFFFF' } }}
                                    textColor={isDark ? '#FFFFFF' : '#000000'}
                                />
                                <TextInput
                                    label="Address"
                                    value={address}
                                    onChangeText={setAddress}
                                    style={styles.input}
                                    mode="outlined"
                                    theme={{ colors: { primary: isDark ? '#FFD700' : '#1A2F42', background: isDark ? '#0F172A' : '#FFFFFF' } }}
                                    textColor={isDark ? '#FFFFFF' : '#000000'}
                                />
                                <TextInput
                                    label="Imam Name"
                                    value={imamName}
                                    onChangeText={setImamName}
                                    style={styles.input}
                                    mode="outlined"
                                    theme={{ colors: { primary: isDark ? '#FFD700' : '#1A2F42', background: isDark ? '#0F172A' : '#FFFFFF' } }}
                                    textColor={isDark ? '#FFFFFF' : '#000000'}
                                />
                                <Button
                                    mode="contained"
                                    onPress={handleRegister}
                                    style={{ marginTop: 16, backgroundColor: '#FFD700' }}
                                    labelStyle={{ color: '#0A1929', fontWeight: 'bold' }}
                                    loading={loading}
                                    disabled={loading || !email || !password || !name || !address || !imamName}
                                    contentStyle={{ height: 50 }}
                                >
                                    Register Mosque
                                </Button>

                                <Button
                                    mode="text"
                                    onPress={() => router.push('/login')}
                                    style={{ marginTop: 16 }}
                                    textColor={isDark ? '#FFD700' : '#1A2F42'}
                                >
                                    Already have an account? Login
                                </Button>
                            </LinearGradient>
                        </Animated.View>
                    </ScrollView>
                </SafeAreaView>
            </IslamicBackground>
        );
    }

    if (!currentMosque) {
        return (
            <IslamicBackground>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: isDark ? '#FFFFFF' : '#000000', marginBottom: 20 }}>Loading Mosque Data...</Text>
                    <Button onPress={logout} mode="outlined" textColor={isDark ? '#FFD700' : '#1A2F42'}>Logout</Button>
                </SafeAreaView>
            </IslamicBackground>
        );
    }

    return (
        <IslamicBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                    <Appbar.Content title="Imam Dashboard" titleStyle={{ color: isDark ? '#FFD700' : '#1A2F42', fontWeight: 'bold' }} />
                    <Appbar.Action icon="logout" onPress={() => { logout(); router.replace('/'); }} color={isDark ? '#FFD700' : '#1A2F42'} />
                </Appbar.Header>

                <ScrollView contentContainerStyle={styles.dashboardContent}>
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <LinearGradient
                            colors={isDark ? ['rgba(26, 47, 66, 0.9)', 'rgba(13, 31, 45, 0.95)'] : ['#FFFFFF', '#F8FAFC']}
                            style={[styles.mosqueCard, !isDark && styles.cardShadow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.cardContent}>
                                <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(26, 95, 122, 0.1)' }]}>
                                    <Text style={{ fontSize: 32 }}>🕌</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text variant="headlineSmall" style={{ color: isDark ? '#FFD700' : '#1A2F42', fontWeight: 'bold' }}>{currentMosque.name}</Text>
                                    <Text variant="bodyMedium" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>{currentMosque.address}</Text>
                                    <Text variant="labelLarge" style={{ marginTop: 8, color: isDark ? '#E2E8F0' : '#475569' }}>Imam: {currentMosque.imamName}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    <Text variant="titleMedium" style={{ marginTop: 24, marginBottom: 16, marginLeft: 8, color: isDark ? '#E2E8F0' : '#1A2F42', fontWeight: '600' }}>
                        Current Prayer Timings
                    </Text>

                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <LinearGradient
                            colors={isDark ? ['rgba(26, 47, 66, 0.9)', 'rgba(13, 31, 45, 0.95)'] : ['#FFFFFF', '#F8FAFC']}
                            style={[styles.timingsCard, !isDark && styles.cardShadow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            {Object.entries(currentMosque.timings).map(([prayer, time], index) => (
                                <View key={prayer} style={[styles.timingRow, { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', borderBottomWidth: index === Object.entries(currentMosque.timings).length - 1 ? 0 : 1 }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <IconButton icon="clock-outline" size={20} iconColor={isDark ? '#94A3B8' : '#64748B'} />
                                        <Text variant="titleMedium" style={{ textTransform: 'capitalize', color: isDark ? '#E2E8F0' : '#1A2F42' }}>{prayer}</Text>
                                    </View>
                                    <Text variant="headlineSmall" style={{ color: '#FFD700', fontWeight: 'bold' }}>{time}</Text>
                                </View>
                            ))}
                        </LinearGradient>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(700).springify()}>
                        <Button
                            mode="contained"
                            icon="clock-edit"
                            onPress={() => router.push('/imam/update-timing')}
                            style={styles.updateButton}
                            contentStyle={{ height: 56 }}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold', color: '#0A1929' }}
                        >
                            Update Timings
                        </Button>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </IslamicBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
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
    input: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    divider: {
        height: 1,
        marginVertical: 20,
    },
    dashboardContent: {
        padding: 20,
    },
    mosqueCard: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    iconBadge: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timingsCard: {
        padding: 8,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    timingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    updateButton: {
        marginTop: 30,
        borderRadius: 16,
        backgroundColor: '#FFD700',
        elevation: 4,
    }
});

