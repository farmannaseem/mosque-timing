import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, TextInput, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicBackground } from '../components/IslamicBackground';
import { useApp } from '../contexts/AppContext';

export default function LoginScreen() {
    const { loginImam } = useApp();
    const theme = useTheme();
    const router = useRouter();
    const isDark = theme.dark;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await loginImam(email, password);
            router.replace('/imam');
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IslamicBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                    <Appbar.BackAction onPress={() => router.back()} color={isDark ? '#FFD700' : '#1A2F42'} />
                    <Appbar.Content title="Imam Login" titleStyle={{ color: isDark ? '#FFD700' : '#1A2F42', fontWeight: 'bold' }} />
                </Appbar.Header>

                <View style={styles.container}>
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <LinearGradient
                            colors={isDark ? ['rgba(26, 47, 66, 0.9)', 'rgba(13, 31, 45, 0.95)'] : ['#FFFFFF', '#F8FAFC']}
                            style={[styles.formCard, !isDark && styles.cardShadow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text variant="titleLarge" style={{ marginBottom: 24, textAlign: 'center', color: isDark ? '#FFD700' : '#1A2F42', fontWeight: 'bold' }}>
                                Welcome Back
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

                            <Button
                                mode="contained"
                                onPress={handleLogin}
                                style={styles.loginButton}
                                contentStyle={{ height: 50 }}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold', color: '#0A1929' }}
                                loading={loading}
                                disabled={loading || !email || !password}
                            >
                                Login
                            </Button>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </IslamicBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    loginButton: {
        marginTop: 16,
        borderRadius: 16,
        backgroundColor: '#FFD700',
        elevation: 4,
    }
});

