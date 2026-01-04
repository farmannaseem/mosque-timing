import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Icon, Searchbar, Text, TouchableRipple, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicBackground } from '../../components/IslamicBackground';
import { Mosque, useApp } from '../../contexts/AppContext';

export default function UserScreen() {
    const { mosques, selectMosqueForUser } = useApp();
    const theme = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const isDark = theme.dark;

    const filteredMosques = mosques.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMosquePress = (mosque: Mosque) => {
        selectMosqueForUser(mosque.id);
        router.push(`/user/mosque/${mosque.id}`);
    };

    const renderItem = ({ item, index }: { item: Mosque, index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <TouchableRipple
                onPress={() => handleMosquePress(item)}
                style={styles.cardTouchable}
                rippleColor="rgba(255, 215, 0, 0.1)"
            >
                <LinearGradient
                    colors={isDark ? ['rgba(6, 78, 59, 0.9)', 'rgba(2, 44, 34, 0.95)'] : ['#FFFFFF', '#F0FDF4']}
                    style={[styles.cardGradient, !isDark && styles.cardShadow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(255, 215, 0, 0.15)' : 'rgba(16, 185, 129, 0.1)' }]}>
                            <Icon source="mosque" size={28} color={isDark ? '#FFD700' : '#047857'} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleMedium" style={{ color: isDark ? '#FFD700' : '#047857', fontWeight: 'bold' }}>
                                {item.name}
                            </Text>
                            <View style={styles.infoRow}>
                                <Icon source="map-marker" size={14} color={theme.colors.onSurfaceVariant} />
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                                    {item.address}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Icon source="account" size={14} color={theme.colors.onSurfaceVariant} />
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                                    Imam: {item.imamName}
                                </Text>
                            </View>
                        </View>
                        <Icon source="chevron-right" size={24} color={isDark ? '#FFD700' : '#047857'} />
                    </View>
                </LinearGradient>
            </TouchableRipple>
        </Animated.View>
    );

    return (
        <IslamicBackground>
            <SafeAreaView style={{ flex: 1 }}>
                <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                    <Appbar.BackAction onPress={() => router.back()} color={isDark ? '#FFD700' : '#064E3B'} />
                    <Appbar.Content title="Find a Mosque" titleStyle={{ color: isDark ? '#FFD700' : '#064E3B', fontWeight: 'bold' }} />
                </Appbar.Header>

                <View style={styles.container}>
                    <Searchbar
                        placeholder="Search by name or location"
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(6, 78, 59, 0.8)' : '#FFFFFF' }]}
                        iconColor={isDark ? '#FFD700' : '#047857'}
                        placeholderTextColor={isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'}
                        inputStyle={{ color: isDark ? '#FFFFFF' : '#000000' }}
                    />

                    <FlatList
                        data={filteredMosques}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Icon source="mosque" size={64} color={theme.colors.onSurfaceVariant} />
                                <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
                                    No mosques found.
                                </Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                                    Try a different search term
                                </Text>
                            </View>
                        }
                    />
                </View>
            </SafeAreaView>
        </IslamicBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        margin: 20,
        borderRadius: 16,
        elevation: 0,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cardTouchable: {
        borderRadius: 20,
        marginBottom: 16,
    },
    cardGradient: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.1)',
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 80,
    }
});

