import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const lightColors = {
  ...MD3LightTheme.colors,
  primary: '#1A5F7A', // Islamic Teal
  secondary: '#0EA5E9', // Sky 500
  tertiary: '#38BDF8', // Sky 400
  background: '#F0F8FF', // Light Blue
  surface: '#FFFFFF',
  error: '#EF4444',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onSurface: '#0F172A', // Slate 900
  onSurfaceVariant: '#64748B',
};

const darkColors = {
  ...MD3DarkTheme.colors,
  primary: '#FFD700', // Islamic Gold
  secondary: '#FFA500', // Orange Gold
  tertiary: '#FFE55C', // Light Gold
  background: '#0A1929', // Deep Navy Blue
  surface: '#1A2F42', // Navy Blue
  error: '#CF6679',
  onPrimary: '#0A1929', // Dark text on gold
  onSecondary: '#0A1929',
  onSurface: '#F8FAFC', // Light text
  onSurfaceVariant: '#94A3B8',
  elevation: {
    level0: 'transparent',
    level1: '#1A2F42', // Navy
    level2: '#243B53', // Lighter Navy
    level3: '#2E4A63',
    level4: '#385573',
    level5: '#426083',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
  roundness: 16,
  dark: false,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
  roundness: 16,
  dark: true,
};

