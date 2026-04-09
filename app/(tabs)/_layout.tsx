import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#CAA4F3",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#312F44",
          borderTopColor: "#313244",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: insets.bottom + 10,
          paddingTop: 8,
          borderRadius:20,
          marginBottom: 20,
          marginHorizontal: 16
          
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Jua_400Regular",
        },
      }}
      
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Kitchen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
