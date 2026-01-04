import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export const AnimatedMosque = () => {
    const theme = useTheme();
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-15, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
                withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sin) })
            ),
            -1, // Infinite repeat
            true // Reverse (though sequence handles it, this makes it smoother if we just used one timing)
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={animatedStyle}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.elevation.level2 }]}>
                    <MaterialCommunityIcons name="mosque" size={80} color={theme.colors.primary} />
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    iconContainer: {
        padding: 20,
        borderRadius: 100,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    }
});
