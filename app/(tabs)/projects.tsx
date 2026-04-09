import NoKey from "@/components/NoKey";
import PersonalProjectCard from "@/components/PersonalProjectCard";
import { getApiKey, getUserID } from "@/lib/authStore";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Projects() {
  const [hasAuth, setHasAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  const fetchMyProjects = async () => {
    try {
      const key = await getApiKey();
      const id = await getUserID();

      if (!key || !id) {
        setHasAuth(false);
        setLoading(false);
        return;
      }

      setHasAuth(true);

      const response = await fetch(`https://flavortown.hackclub.com/api/v1/users/${id}/projects`, {
        headers: { "Authorization": `Bearer ${key}` }
      });
      
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyProjects();
    }, [])
  );

  if (loading) {
    return (
      <ImageBackground source={require("@/assets/BG.webp")} className="flex-1 justify-center">
        <ActivityIndicator size="large" color="#ff8c00" />
      </ImageBackground>
    );
  }

  if (!hasAuth) {
    return <NoKey />;
  }

  return (
    <ImageBackground 
      source={require("@/assets/BG.webp")} 
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center pt-20">
        <Text className="text-3xl text-white bg-[#313244] py-2 px-10 rounded-[10px]" style={{ fontFamily: "Jua_400Regular" }}>
          Your Projects
        </Text>
        
        <ScrollView 
          className="flex-1 w-full px-11"
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 60, gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {projects.length > 0 ? (
            projects.map((project) => {
              const finalImageUrl = project.banner_url 
                ? (project.banner_url.startsWith('http') 
                    ? project.banner_url 
                    : `https://flavortown.hackclub.com${project.banner_url}`)
                : null;

              return (
                <PersonalProjectCard 
                  title={project.title} 
                  description={project.description} 
                  id={project.id}
                  image={finalImageUrl} 
                  key={project.id} 
                  onPress={() => router.push({ pathname: "/NewProject", params: { id: project.id } })}
                />
              );
            })
          ) : (
            <View className="items-center py-10">
              <Text className="text-gray-400 italic">No projects shipped yet.</Text>
            </View>
          )}

          <TouchableOpacity 
            onPress={() => router.push('/CreateProject')} 
            className="py-4 px-3 rounded-[20px] bg-[#303143] items-center border border-white/10"
          >
            <Text className="text-white text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>
              + Create Project
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}