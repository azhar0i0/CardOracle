import { Stack, router } from 'expo-router';
import { View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import '../global.css';

// Prevent the splash screen from auto-hiding until we're ready
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading } = useAuth();

  // navigation happens AFTER render
  useEffect(() => {
    if (loading) return; // If the app is still loading, don’t navigate

    // If no session, navigate to the sign-in screen, else navigate to home
    if (!session) {
      router.replace('/');
    } else {
      router.replace('/home');
    }
  }, [session, loading]);

  // Hide splash screen after the root view layout
  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    // While loading, keep the splash screen visible
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {/* This renders the correct screen depending on session status */}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
