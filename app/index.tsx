import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Text, TouchableRipple } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HangingLamp } from '../components/HangingLamp';
import { IslamicBackground } from '../components/IslamicBackground';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
    const router = useRouter();
    const { toggleTheme, themeMode } = useApp();
    const isDark = themeMode === 'dark';

    return (
        <IslamicBackground>
            {/* Hanging Lamps Decoration - Adjusted positions */}
            <HangingLamp style={{ left: '10%', top: -20 }} length={120} duration={4000} delay={0} size={45} color="#FFD700" />
            <HangingLamp style={{ left: '30%', top: -40 }} length={90} duration={3500} delay={500} size={35} color="#FFD700" />
            <HangingLamp style={{ right: '30%', top: -30 }} length={100} duration={4200} delay={800} size={40} color="#FFD700" />
            <HangingLamp style={{ right: '10%', top: -10 }} length={130} duration={3800} delay={300} size={48} color="#FFD700" />

            <SafeAreaView style={styles.safeArea}>
                {/* Theme Toggle Button */}
                <View style={styles.headerRow}>
                    <IconButton
                        icon={isDark ? 'weather-sunny' : 'weather-night'}
                        onPress={toggleTheme}
                        mode="contained"
                        containerColor={isDark ? "rgba(255, 215, 0, 0.15)" : "rgba(0, 0, 0, 0.05)"}
                        iconColor={isDark ? "#FFD700" : "#064E3B"}
                        size={24}
                    />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <Animated.View
                        entering={FadeInDown.delay(300).springify()}
                        style={styles.headerContainer}
                    >
                        <View style={styles.mosqueIconContainer}>
                            <LinearGradient
                                colors={isDark ? ['#FFD700', '#FFA000'] : ['#064E3B', '#022C22']}
                                style={styles.mosqueIconBackground}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.mosqueEmoji}>🕌</Text>
                            </LinearGradient>
                        </View>

                        <Text style={[styles.mainTitle, { color: isDark ? '#FFD700' : '#064E3B' }]}>
                            Mosque Timing
                        </Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#E2E8F0' : '#475569' }]}>
                            Connect with your spiritual community
                        </Text>
                    </Animated.View>

                    {/* Cards Container */}
                    <View style={styles.cardsContainer}>
                        {/* For Imams Card */}
                        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.cardWrapper}>
                            <TouchableRipple
                                onPress={() => router.push('/imam')}
                                style={styles.cardTouchable}
                                rippleColor="rgba(255, 215, 0, 0.1)"
                            >
                                <LinearGradient
                                    colors={isDark ? ['rgba(6, 78, 59, 0.9)', 'rgba(2, 44, 34, 0.95)'] : ['#FFFFFF', '#F0FDF4']}
                                    style={[styles.cardGradient, !isDark && styles.cardShadow]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.cardContent}>
                                        <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.1)' : 'rgba(6, 78, 59, 0.05)' }]}>
                                            <Text style={styles.cardEmoji}>👳</Text>
                                        </View>
                                        <View style={styles.cardTextContent}>
                                            <Text style={[styles.cardTitle, { color: isDark ? '#FFD700' : '#064E3B' }]}>For Imams</Text>
                                            <Text style={[styles.cardDescription, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                                                Manage prayer times & notify community
                                            </Text>
                                        </View>
                                        <IconButton icon="arrow-right" iconColor={isDark ? '#FFD700' : '#064E3B'} size={24} />
                                    </View>
                                </LinearGradient>
                            </TouchableRipple>
                        </Animated.View>

                        {/* For Users Card */}
                        <Animated.View entering={FadeInUp.delay(800).springify()} style={styles.cardWrapper}>
                            <TouchableRipple
                                onPress={() => router.push('/user')}
                                style={styles.cardTouchable}
                                rippleColor="rgba(255, 215, 0, 0.1)"
                            >
                                <LinearGradient
                                    colors={isDark ? ['rgba(6, 78, 59, 0.9)', 'rgba(2, 44, 34, 0.95)'] : ['#FFFFFF', '#F0FDF4']}
                                    style={[styles.cardGradient, !isDark && styles.cardShadow]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.cardContent}>
                                        <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.1)' : 'rgba(6, 78, 59, 0.05)' }]}>
                                            <Text style={styles.cardEmoji}>🤲</Text>
                                        </View>
                                        <View style={styles.cardTextContent}>
                                            <Text style={[styles.cardTitle, { color: isDark ? '#FFD700' : '#064E3B' }]}>For Users</Text>
                                            <Text style={[styles.cardDescription, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                                                Find mosques & get prayer updates
                                            </Text>
                                        </View>
                                        <IconButton icon="arrow-right" iconColor={isDark ? '#FFD700' : '#064E3B'} size={24} />
                                    </View>
                                </LinearGradient>
                            </TouchableRipple>
                        </Animated.View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </IslamicBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    headerRow: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 100,
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 50,
        width: '100%',
    },
    mosqueIconContainer: {
        marginBottom: 24,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    mosqueIconBackground: {
        width: 100,
        height: 100,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '45deg' }],
    },
    mosqueEmoji: {
        fontSize: 50,
        transform: [{ rotate: '-45deg' }],
    },
    mainTitle: {
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
        letterSpacing: 0.5,
    },
    cardsContainer: {
        width: '100%',
        maxWidth: 500,
        gap: 20,
    },
    cardWrapper: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    cardTouchable: {
        borderRadius: 24,
    },
    cardGradient: {
        padding: 20,
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
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBadge: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardEmoji: {
        fontSize: 28,
    },
    cardTextContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
});

