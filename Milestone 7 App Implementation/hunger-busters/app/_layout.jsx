import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StripeProvider } from '@stripe/stripe-react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown:false }}/>
        <Stack.Screen name="(auth)" options={{ headerShown:false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown:false }}/>
        <Stack.Screen name="(donations)" options={{ headerShown:false }}/>
        <Stack.Screen name="(experts)" options={{ headerShown:false }}/>
        <Stack.Screen name="(admin)" options={{ headerShown:false }}/>
        <Stack.Screen name="(food)" options={{ headerShown:false }}/>
        <Stack.Screen name="(recipes)" options={{ headerShown:false }}/>
      </Stack>
    </StripeProvider>
  );
};

export default RootLayout;