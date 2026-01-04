import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { MosqueDome } from './IslamicPattern';

const { width } = Dimensions.get('window');

interface PrayerTimesCardProps {
    mosqueName: string;
    timings: {
        fajr: string;
        dhuhr: string;
        asr: string;
        maghrib: string;
        isha: string;
        jummah: string;
    };
    lastUpdated?: string;
}

const prayerIcons: Record<string, string> = {
    fajr: 'weather-sunset-up',
    dhuhr: 'white-balance-sunny',
    asr: 'weather-sunset-down',
    maghrib: 'weather-sunset',
    isha: 'weather-night',
    jummah: 'mosque',
};

const prayerNames: Record<string, string> = {
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    jummah: 'Jummah',
};

export const PrayerTimesCard: React.FC<PrayerTimesCardProps> = ({
    mosqueName,
    timings,
    lastUpdated,
}) => {
    const theme = useTheme();
    const isDark = theme.dark;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isDark ? ['rgba(26, 47, 66, 0.9)', 'rgba(13, 31, 45, 0.95)'] : ['#FFFFFF', '#F8FAFC']}
                style={[styles.gradient, !isDark && styles.cardShadow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header with Mosque Name */}
                <View style={styles.header}>
                    <MosqueDome color={isDark ? '#FFD700' : '#1A5F7A'} size={60} />
                    <Text
                        variant="headlineSmall"
                        style={[styles.mosqueName, { color: isDark ? '#FFD700' : '#1A5F7A' }]}
                    >
                        {mosqueName}
                    </Text>
                    <Text
                        variant="bodySmall"
                        style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
                    >
                        Prayer Times
                    </Text>
                </View>

                {/* Prayer Times Grid */}
                <View style={styles.timingsGrid}>
                    {Object.entries(timings).map(([prayer, time]) => (
                        <View key={prayer} style={styles.prayerItem}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(26, 95, 122, 0.1)' }
                                ]}
                            >
                                <Icon
                                    source={prayerIcons[prayer] || 'clock-outline'}
                                    size={24}
                                    color={isDark ? '#FFD700' : '#1A5F7A'}
                                />
                            </View>
                            <Text
                                variant="labelMedium"
                                style={[styles.prayerName, { color: theme.colors.onSurface }]}
                            >
                                {prayerNames[prayer]}
                            </Text>
                            <Text
                                variant="titleMedium"
                                style={[styles.prayerTime, { color: isDark ? '#FFD700' : '#1A5F7A' }]}
                            >
                                {time}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Last Updated */}
                {lastUpdated && (
                    <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
                        <Icon source="update" size={14} color={theme.colors.onSurfaceVariant} />
                        <Text
                            variant="bodySmall"
                            style={[styles.lastUpdated, { color: theme.colors.onSurfaceVariant }]}
                        >
                            Updated: {new Date(lastUpdated).toLocaleDateString()}
                        </Text>
                    </View>
                )}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        marginVertical: 10,
        width: width - 40,
        alignSelf: 'center',
    },
    gradient: {
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
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    mosqueName: {
        fontWeight: 'bold',
        marginTop: 12,
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 4,
        opacity: 0.7,
    },
    timingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    prayerItem: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    prayerName: {
        marginBottom: 4,
        opacity: 0.8,
        fontWeight: '500',
    },
    prayerTime: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        gap: 6,
    },
    lastUpdated: {
        opacity: 0.7,
    },
});

