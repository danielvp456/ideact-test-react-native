import { useFonts } from 'expo-font';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import Home from './(tabs)/index';
import TrackDetails from './(tabs)/trackDetails';
import Profile from './(tabs)/profile';
import NotFoundScreen from './+not-found';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="trackDetails" component={TrackDetails} options={{ headerShown: false }} />
        <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
