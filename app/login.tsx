import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../contexts/AppContext';

export default function LoginScreen() {
    const { loginImam } = useApp();
    const theme = useTheme();
    const router = useRouter();

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
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Imam Login" />
            </Appbar.Header>

            <View style={styles.container}>
                <Surface style={styles.formCard}>
                    <Text variant="titleLarge" style={{ marginBottom: 20, textAlign: 'center' }}>Welcome Back</Text>

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

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={{ marginTop: 10 }}
                        loading={loading}
                        disabled={loading || !email || !password}
                    >
                        Login
                    </Button>
                </Surface>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});
