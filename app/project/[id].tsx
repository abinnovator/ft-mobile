import { getApiKey, getUserID } from "@/lib/authStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function ProjectPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  console.log(id)

  const fetchProject = async () => {
    try {
      const key = await getApiKey();
      const myId = await getUserID();
      const headers = { "Authorization": `Bearer ${key}` };

      const url = `https://flavortown.hackclub.com/api/v1/projects/${id}`;
      console.log("Fetching URL:", url);
      const res = await fetch(url, { headers });
      const data = await res.json();
      console.log(data.banner_url)

      setProject(data);

      if (data.user_id === Number(myId)) {
        setIsOwner(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  if (loading) {
    return (
      <ImageBackground source={require("@/assets/BG.webp")} className="flex-1 justify-center">
        <ActivityIndicator size="large" color="#ff8c00" />
      </ImageBackground>
    );
  }
  console.log(project?.banner_url)



  return (
    <ImageBackground source={require("@/assets/BG.webp")} className="flex-1" resizeMode="cover">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}>
        
        
          <Image source={{ uri: `https://flavortown.hackclub.com/${project?.banner_url}` || "https://flavortown.hackclub.com/assets/default-banner-3d4e1b67.png" }} className="w-full h-64" resizeMode="cover" />


        <View className="px-6 mt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-3xl text-black" style={{ fontFamily: "Jua_400Regular" }}>
                {project?.title}
              </Text>
              <View className="bg-green-600 self-start px-3 py-1 rounded-full mt-2">
                <Text className="text-white text-xs uppercase font-bold">{project?.ship_status}</Text>
              </View>
            </View>
            

          </View>

          <View className="bg-[#313244] p-5 rounded-2xl mt-6 border border-white/10">
            <Text className="text-gray-300 text-lg leading-6">{project?.description}</Text>
          </View>

          

          <View className="flex-row gap-4 mt-8">
            {project?.repo_url && (
              <TouchableOpacity 
                onPress={() => Linking.openURL(project.repo_url)}
                className="flex-1 bg-[#24292e] py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold">GitHub</Text>
              </TouchableOpacity>
            )}
            {project?.demo_url && (
              <TouchableOpacity 
                onPress={() => Linking.openURL(project.demo_url)}
                className="flex-1 bg-blue-600 py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold">Live Demo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}