import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Card, Searchbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mosque, useApp } from '../../contexts/AppContext';

export default function UserScreen() {
    const { mosques, selectMosqueForUser } = useApp();
    const theme = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMosques = mosques.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleMosquePress = (mosque: Mosque) => {
        selectMosqueForUser(mosque.id);
        router.push(`/user/mosque/${mosque.id}`);
    };

    const renderItem = ({ item }: { item: Mosque }) => (
        <Card style={styles.card} onPress={() => handleMosquePress(item)}>
            <Card.Title
                title={item.name}
                subtitle={item.address}
                left={(props) => <Avatar.Icon {...props} icon="mosque" style={{ backgroundColor: theme.colors.primary }} />}
            />
            <Card.Content>
                <Text variant="bodySmall" style={{ color: 'gray' }}>Imam: {item.imamName}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Find a Mosque" />
            </Appbar.Header>

            <View style={styles.container}>
                <Searchbar
                    placeholder="Search by name or location"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <FlatList
                    data={filteredMosques}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text variant="bodyLarge" style={{ color: 'gray' }}>No mosques found.</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        margin: 20,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        marginBottom: 15,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    }
});
