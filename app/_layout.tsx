import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import LoginScreen from "./login";
import CustomHeader from "@/components/CustomHeader";


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
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {isLoggedIn ? (
        <>
          <CustomHeader />
          <Slot />
        </>
      ) : (
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
      )}
      <StatusBar style="inverted" backgroundColor="orange" />
    </ThemeProvider>
  );
}
