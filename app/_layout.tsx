import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Toast from 'react-native-toast-message';

import { useColorScheme } from "@/hooks/useColorScheme";

import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import { ToastProvider } from "@/context/ToastContext"; // Import the ToastProvider
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const { role, loading } = useGlobalContext();
  const [fontsLoaded] = useFonts({
    "Vazir-Bold": require("@/assets/fonts/Vazir-Bold-FD-WOL.ttf"),
    "Vazir-Regular": require("@/assets/fonts/Vazir-FD-WOL.ttf")
  });

  const colorScheme = useColorScheme();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const queryClient = new QueryClient();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <ThemeProvider
        // theme={customTheme}
        // value={CustomTheme}
        // value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        value={DefaultTheme}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(menu)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="error" options={{ headerShown: false }} />
            </Stack>
          </ToastProvider>
          <StatusBar style="light" />
        </QueryClientProvider>
      </ThemeProvider>
    </GlobalProvider>
  );
}
