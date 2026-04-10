import DevlogCard from "@/components/DevlogCard";
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
  const [devlogs, setDevlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProjectData = async () => {
    try {
      const key = await getApiKey();
      const myId = await getUserID();
      const headers = { "Authorization": `Bearer ${key}` };

      const projectUrl = `https://flavortown.hackclub.com/api/v1/projects/${id}`;
      const devlogsUrl = `https://flavortown.hackclub.com/api/v1/projects/${id}/devlogs?page=1&limit=40`;

      const [projectRes, devlogsRes] = await Promise.all([
        fetch(projectUrl, { headers }),
        fetch(devlogsUrl, { headers })
      ]);

      const projectData = await projectRes.json();
      const devlogsResponse = await devlogsRes.json();

      setProject(projectData);
      setDevlogs(devlogsResponse.devlogs || []);

      if (projectData.user_id === Number(myId)) {
        setIsOwner(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
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
      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 60, paddingBottom: 40 }}>
        
        <Image 
          source={{ uri: project?.banner_url ? `https://flavortown.hackclub.com/${project.banner_url}` : "https://flavortown.hackclub.com/assets/default-banner-3d4e1b67.png" }} 
          className="mx-4 rounded-2xl h-64" 
          resizeMode="cover" 
        />

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

          <View className="bg-card p-5 rounded-2xl mt-6 border border-white/10">
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
                className="flex-1 bg-accent py-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold">Live Demo</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-3xl text-black mt-10" style={{ fontFamily: "Jua_400Regular" }}>
            Devlogs
          </Text>

          <View className="flex flex-col gap-2 mt-4">
            {devlogs && devlogs.length > 0 ? (
              devlogs.map((log: any) => (
                <DevlogCard 
                  key={log.id} 
                  username={project?.user_display_name || "Member"}
                  time={new Date(log.created_at).toLocaleDateString()}
                  timeLogged={`${(log.duration_seconds / 3600).toFixed(1)}h`} 
                  description={log.body} 
                  project={project?.title}
                />
              ))
            ) : (
              <Text className="text-gray-600 text-center mt-4">No devlogs found for this project.</Text>
            )}
          </View>
        </View>
        
      </ScrollView>
    </ImageBackground>
  );
}