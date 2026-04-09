import { getApiKey } from "@/lib/authStore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, ScrollView, Text, View } from "react-native";

interface UserProfile {
  id: number;
  display_name: string;
  slack_id: string;
  avatar: string;
  cookies: number | null;
  devlog_seconds_today: number;
  devlog_seconds_total: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
}

export default function UserProfilePage() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    
    try {
      const key = await getApiKey();
      const headers = { "Authorization": `Bearer ${key}` };

      const userRes = await fetch(`https://flavortown.hackclub.com/api/v1/users/${id}`, { headers });
      const userData = await userRes.json();
      setUser(userData);

      const projectRes = await fetch(`https://flavortown.hackclub.com/api/v1/users/${userData.id}/projects?page=1`, { headers });
      const projectData = await projectRes.json();
      
      setUserProjects(projectData.projects || []);

    } catch (e) {
      console.error("Profile fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatHours = (seconds: number | undefined) => {
    if (!seconds) return "0.00";
    return (seconds / 3600).toFixed(2);
  };

  useEffect(() => { 
    fetchUserData(); 
  }, [id]);

  if (loading) {
    return (
      <ImageBackground source={require("@/assets/BG.webp")} className="flex-1 justify-center">
        <ActivityIndicator size="large" color="#ff8c00" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require("@/assets/BG.webp")} className="flex-1" resizeMode="cover">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 80, paddingHorizontal: 25, paddingBottom: 40 }}>
        
        {/* --- PROFILE HEADER CARD --- */}
        <View className="items-center mb-10 bg-[#d7b592] p-6 rounded-[24px] shadow-xl border border-white/20">
          <View className="w-24 h-24 rounded-full border-4 border-[#ff8c00] overflow-hidden mb-4 bg-[#313244]">
             <Image 
                source={{ uri: user?.avatar || 'https://github.com/identicons/hackclub.png' }} 
                className="w-full h-full" 
             />
          </View>
          
          <Text className="text-3xl text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>
            {user?.display_name || "Unknown Hacker"}
          </Text>
          <Text className="text-gray-700 text-lg">@{user?.slack_id}</Text>
          
          <View className="bg-[#313244] px-6 py-2 rounded-full mt-4 flex-row items-center">
            <Text className="text-[#ff8c00] text-xl mr-2" style={{ fontFamily: "Jua_400Regular" }}>
                {user?.cookies ?? 0}
            </Text>
            <Text className="text-white text-sm">Cookies Earned 🍪</Text>
          </View>

          {/* --- STATS SECTION --- */}
          <View className="pt-6 w-full border-t border-white/30 mt-6 flex-row justify-around">
            <View className="items-center">
                <Text className="text-white text-xs opacity-80 uppercase font-bold">Today</Text>
                <Text className="text-white text-lg" style={{ fontFamily: "Jua_400Regular" }}>
                    {formatHours(user?.devlog_seconds_today)} hrs
                </Text>
            </View>
            <View className="items-center">
                <Text className="text-white text-xs opacity-80 uppercase font-bold">Total</Text>
                <Text className="text-white text-lg" style={{ fontFamily: "Jua_400Regular" }}>
                    {formatHours(user?.devlog_seconds_total)} hrs
                </Text>
            </View>
          </View>
        </View>

        {/* --- PROJECTS SECTION --- */}
        <Text className="text-2xl text-white mb-5" style={{ fontFamily: "Jua_400Regular" }}>
            The Lab ({userProjects.length} Ships)
        </Text>

        {userProjects.length > 0 ? (
          userProjects.map((project) => (
            <View key={project.id} className="bg-[#313244] p-5 rounded-2xl border border-white/10 mb-4 shadow-sm">
                <Text className="text-[#ff8c00] text-xl mb-1" style={{ fontFamily: "Jua_400Regular" }}>
                    {project.title}
                </Text>
                <Text className="text-gray-300 text-sm leading-5">
                    {project.description}
                </Text>
            </View>
          ))
        ) : (
          <View className="bg-[#313244]/50 p-12 rounded-2xl items-center border border-dashed border-gray-500">
            <Text className="text-gray-400 italic text-center">
              This hacker hasn&apos;t revealed any ships in the lab yet...
            </Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}