import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme } from '../constants/theme';
import { AppProvider, useApp } from '../contexts/AppContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function ThemedLayout() {
  const { themeMode } = useApp();
  const activeTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={activeTheme} key={themeMode}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} backgroundColor={activeTheme.colors.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: activeTheme.colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="imam/index" />
        <Stack.Screen name="imam/update-timing" />
        <Stack.Screen name="user/index" />
        <Stack.Screen name="user/mosque/[id]" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.log('Failed to get push token for push notification!');
          return;
        }
      }
    })();
  }, []);

  return (
    <AppProvider>
      <ThemedLayout />
    </AppProvider>
  );
}
