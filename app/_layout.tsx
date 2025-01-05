import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import CustomHeader from "@/components/CustomHeader";
import OnBoardingScreen from ".";
import GlobalProvider from "@/context/GlobalProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Vazir-Bold": require("@/assets/fonts/Vazir-Bold-FD-WOL.ttf"),
    "Vazir-Regular": require("@/assets/fonts/Vazir-FD-WOL.ttf")
  });

  const colorScheme = useColorScheme();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider
      // theme={customTheme}
      // value={CustomTheme}
      // value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      value={DefaultTheme}
    >
      <GlobalProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/[query]"
            options={{ headerShown: false }}
          /> */}
        </Stack>
      </GlobalProvider>
      <StatusBar style="inverted" backgroundColor="orange" />
    </ThemeProvider>
  );
}
