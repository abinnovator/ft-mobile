import { Jua_400Regular, useFonts } from "@expo-google-fonts/jua";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Jua_400Regular,
  });

  const [theme, setTheme] = useState("vanilla");

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className={`flex-1 ${theme}`}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}