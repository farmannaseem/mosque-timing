import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Icon, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicBackground } from '../../../components/IslamicBackground';
import { PrayerTimesCard } from '../../../components/PrayerTimesCard';
import { useApp } from '../../../contexts/AppContext';

export default function MosqueDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { mosques } = useApp();
    const theme = useTheme();
    const router = useRouter();
    const isDark = theme.dark;

    const mosque = mosques.find(m => m.id === id);

    if (!mosque) {
        return (
            <IslamicBackground>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: isDark ? '#FFFFFF' : '#000000', marginBottom: 20 }}>Mosque not found</Text>
                    <Button onPress={() => router.back()} mode="outlined" textColor={isDark ? '#FFD700' : '#1A2F42'}>Go Back</Button>
                </SafeAreaView>
            </IslamicBackground>
        );
    }

    return (
        <IslamicBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                    <Appbar.BackAction onPress={() => router.back()} color={isDark ? '#FFD700' : '#064E3B'} />
                    <Appbar.Content title={mosque.name} titleStyle={{ color: isDark ? '#FFD700' : '#064E3B', fontWeight: 'bold' }} />
                </Appbar.Header>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Mosque Info Card */}
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <LinearGradient
                            colors={isDark ? ['rgba(6, 78, 59, 0.9)', 'rgba(2, 44, 34, 0.95)'] : ['#FFFFFF', '#F0FDF4']}
                            style={[styles.mosqueCard, !isDark && styles.cardShadow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.mosqueHeader}>
                                <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(16, 185, 129, 0.1)' }]}>
                                    <Icon source="mosque" size={40} color={isDark ? '#FFD700' : '#047857'} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text variant="headlineSmall" style={{ color: isDark ? '#FFD700' : '#047857', fontWeight: 'bold' }}>
                                        {mosque.name}
                                    </Text>
                                    <View style={styles.infoRow}>
                                        <Icon source="map-marker" size={16} color={theme.colors.onSurfaceVariant} />
                                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                                            {mosque.address}
                                        </Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Icon source="account" size={16} color={theme.colors.onSurfaceVariant} />
                                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                                            Imam: {mosque.imamName}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Prayer Times Card */}
                    <Animated.View entering={FadeInDown.delay(500).springify()}>
                        <PrayerTimesCard
                            mosqueName={mosque.name}
                            timings={mosque.timings}
                            lastUpdated={mosque.lastUpdated}
                        />
                    </Animated.View>

                    {/* Notification Info */}
                    <Animated.View entering={FadeInDown.delay(700).springify()}>
                        <LinearGradient
                            colors={isDark ? ['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)'] : ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                            style={styles.notificationCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Icon source="bell-ring" size={24} color={isDark ? '#FFD700' : '#047857'} />
                            <Text variant="bodyMedium" style={{ flex: 1, marginLeft: 12, color: theme.colors.onSurface }}>
                                You will receive notifications when prayer timings are updated for this mosque.
                            </Text>
                        </LinearGradient>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </IslamicBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    mosqueCard: {
        marginBottom: 20,
        borderRadius: 24,
        padding: 20,
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
    mosqueHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    iconBadge: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    notificationCard: {
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
    },
});

