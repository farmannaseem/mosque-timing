import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface HangingLampProps {
    delay?: number;
    duration?: number;
    style?: any;
    size?: number;
    color?: string;
    length?: number;
}

export const HangingLamp: React.FC<HangingLampProps> = ({
    delay = 0,
    duration = 3000,
    style,
    size = 40,
    color,
    length = 100
}) => {
    const theme = useTheme();
    const rotate = useSharedValue(0);
    const lampColor = color || theme.colors.secondary;

    useEffect(() => {
        rotate.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(5, { duration: duration, easing: Easing.inOut(Easing.sin) }),
                    withTiming(-5, { duration: duration, easing: Easing.inOut(Easing.sin) })
                ),
                -1, // Infinite
                true // Reverse
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotate.value}deg` }],
        };
    });

    return (
        <Animated.View style={[styles.container, style, animatedStyle]}>
            <View style={[styles.string, { height: length, backgroundColor: lampColor }]} />
            <MaterialCommunityIcons name="ceiling-light" size={size} color={lampColor} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -20, // Start slightly above to hide the string start
        alignItems: 'center',
        zIndex: 0,
    },
    string: {
        width: 2,
    },
});
