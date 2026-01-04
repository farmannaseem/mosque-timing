import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IslamicPattern } from './IslamicPattern';

const { width, height } = Dimensions.get('window');

interface IslamicBackgroundProps {
    children: React.ReactNode;
}

export const IslamicBackground: React.FC<IslamicBackgroundProps> = ({ children }) => {
    const theme = useTheme();

    const isDark = theme.dark;

    // Richer, deeper gradients matching the new Green/Gold theme
    const gradientColors: [string, string, string] = isDark
        ? ['#022C22', '#064E3B', '#065F46'] // Deep Emerald Black -> Emerald 900 -> Emerald 800
        : ['#F0FDF4', '#ECFDF5', '#D1FAE5']; // Very Light Green/White -> Mint 50 -> Mint 100

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
            />

            {/* Islamic Pattern Overlay */}
            <View style={styles.patternContainer} pointerEvents="none">
                <IslamicPattern
                    width={width}
                    height={height}
                    color={isDark ? '#FFD700' : '#1A2F42'}
                    opacity={isDark ? 0.03 : 0.03}
                />
            </View>

            {/* Arabic Calligraphy Watermark */}
            <View style={styles.calligraphyContainer} pointerEvents="none">
                <Text style={[styles.calligraphyText, { color: isDark ? '#FFD700' : '#1A2F42' }]}>
                    ﷽
                </Text>
            </View>

            {/* Corner decorative patterns */}
            <View style={styles.topLeftCorner} pointerEvents="none">
                <IslamicPattern
                    width={200}
                    height={200}
                    color={isDark ? '#FFD700' : '#1A2F42'}
                    opacity={0.08}
                />
            </View>

            <View style={styles.bottomRightCorner} pointerEvents="none">
                <IslamicPattern
                    width={200}
                    height={200}
                    color={isDark ? '#FFD700' : '#1A2F42'}
                    opacity={0.08}
                />
            </View>

            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    patternContainer: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
    },
    calligraphyContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0,
    },
    calligraphyText: {
        fontSize: 120,
        opacity: 0.07,
        textAlign: 'center',
    },
    topLeftCorner: {
        position: 'absolute',
        top: -60,
        left: -60,
        opacity: 0.4,
    },
    bottomRightCorner: {
        position: 'absolute',
        bottom: -60,
        right: -60,
        opacity: 0.4,
        transform: [{ rotate: '180deg' }],
    },
});


