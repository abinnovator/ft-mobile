import NoKey from "@/components/NoKey"; // Make sure this is exported correctly
import PersonalProjectCard from "@/components/PersonalProjectCard";
import { getApiKey, getUserID } from "@/lib/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Projects() {
  const [hasAuth, setHasAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const router = useRouter();
  const fetchRandomDevlogs = async () => {
      try {
        const response = await fetch(`http://ftpdb.jam06452.uk/api/user_projects/${await getUserID()}`); 
        const data = await response.json();
        setProjects(data); // 5. Update state with real data
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchRandomDevlogs();
    }, []); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const key = await getApiKey();
        const id = await getUserID();

        // Only grant access if BOTH exist
        if (key && id) {
          setHasAuth(true);
        } else {
          setHasAuth(false);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
          contentContainerStyle={{ paddingTop: 80, paddingBottom: 40, gap: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {projects.map((project)=> (
            <PersonalProjectCard title={project.title} description={project.description} image={project.banner_url} key={project.id} />
          ))}
          <TouchableOpacity onPress={() => router.push('/CreateProject')}  className="py-3 px-3 rounded-[20px] bg-[#303143]"><Text className="text-white text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>+ Create Project</Text></TouchableOpacity>
        </ScrollView>

      </View>
    </ImageBackground>
  );
}