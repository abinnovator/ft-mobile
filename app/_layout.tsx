import { Stack } from "expo-router";
import { useFonts, Jua_400Regular } from "@expo-google-fonts/jua";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Jua_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
