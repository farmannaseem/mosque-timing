import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Premium Islamic Palette
const lightColors = {
  ...MD3LightTheme.colors,
  primary: '#047857', // Emerald 700
  secondary: '#10B981', // Emerald 500
  tertiary: '#059669', // Emerald 600
  background: '#F0FDF4', // Very light green/white
  surface: '#FFFFFF',
  error: '#EF4444',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onSurface: '#022C22', // Emerald 950 (Dark text)
  onSurfaceVariant: '#334155', // Slate 700
  elevation: {
    level0: 'transparent',
    level1: '#FFFFFF',
    level2: '#F8FAFC',
    level3: '#F1F5F9',
    level4: '#E2E8F0',
    level5: '#CBD5E1',
  },
};

const darkColors = {
  ...MD3DarkTheme.colors,
  primary: '#FCD34D', // Amber 300 (Goldish)
  secondary: '#34D399', // Emerald 400
  tertiary: '#FBBF24', // Amber 400
  background: '#022C22', // Deep Emerald Black
  surface: '#064E3B', // Emerald 900
  error: '#F87171',
  onPrimary: '#022C22', // Dark text on gold
  onSecondary: '#022C22',
  onSurface: '#ECFDF5', // Light mint text
  onSurfaceVariant: '#94A3B8', // Slate 400
  elevation: {
    level0: 'transparent',
    level1: '#064E3B', // Emerald 900
    level2: '#065F46', // Emerald 800
    level3: '#047857',
    level4: '#059669',
    level5: '#10B981',
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
