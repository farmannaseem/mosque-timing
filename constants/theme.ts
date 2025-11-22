import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#047857', // Emerald 700
    secondary: '#D97706', // Amber 600
    tertiary: '#10B981', // Emerald 500
    background: '#F0FDF4', // Light Green 50
    surface: '#FFFFFF',
    error: '#EF4444',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1F2937',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F3F4F6',
      level3: '#E5E7EB',
      level4: '#D1D5DB',
      level5: '#9CA3AF',
    },
  },
  roundness: 12,
};
