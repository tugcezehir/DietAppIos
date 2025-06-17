import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/app/auth/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image, View, StyleSheet } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CornerIcon = () => (
  <View style={styles.iconContainer}>
    <Image 
      source={require('../assets/images/icon.png')}
      style={styles.icon}
    />
  </View>
);

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    }
  }, [isAuthenticated, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vkiResults" options={{ presentation: 'modal' }} />
        <Stack.Screen name="calorieInfo" options={{ presentation: 'modal' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
      <CornerIcon />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: 40,
    right: 15,
    zIndex: 999,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
