import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface GradientBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, style }) => {
    const theme = useTheme();
    const isDark = theme.dark;

    // Smooth blue gradient for light mode, dark slate for dark mode
    const colors = (isDark
        ? [theme.colors.background, '#1e293b'] // Dark mode: Slate 900 -> Slate 800
        : ['#f0f9ff', '#e0f2fe', '#bae6fd']) as [string, string, ...string[]]; // Light mode: Sky 50 -> Sky 100 -> Sky 200

    return (
        <LinearGradient
            colors={colors}
            style={[styles.container, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
