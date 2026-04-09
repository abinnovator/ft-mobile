import ExplorePageProjectDevlogCard from "@/components/ExplorePageProjectDevlogCard";
import { getApiKey, getUserID } from "@/lib/authStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Project {
  id: number;
  title: string;
  description: string;
  ship_status: string;
  created_at: string;
}

// Define the User type based on API response
interface User {
  id: number;
  name: string;
  slack_id: string;
  cookie_count: number;
}

export default function Explore() {
  const [activeTab, setActiveTab] = useState<'projects' | 'devlogs' | 'users'>('devlogs');
  const [devlogs, setDevlogs] = useState([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]); // State for users
  const [loading, setLoading] = useState(true);
  const [hasId, setHasId] = useState(true);

  const fetchRandomDevlogs = async () => {
    try {
      const response = await fetch('http://ftpdb.jam06452.uk/api/random_devlogs');
      const data = await response.json();
      setDevlogs(data);
    } catch (error) {
      console.error("Devlog Fetch error:", error);
    }
  };

  const fetchGlobalProjects = async (activeKey: string) => {
    try {
      const response = await fetch('https://flavortown.hackclub.com/api/v1/projects?page=1&limit=10', {
        headers: { "Authorization": `Bearer ${activeKey}` }
      });
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Project Fetch error:", error);
    }
  };

  const fetchGlobalUsers = async (activeKey: string) => {
    try {
      const response = await fetch('https://flavortown.hackclub.com/api/v1/users?page=1&limit=20', {
        headers: { "Authorization": `Bearer ${activeKey}` }
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("User Fetch error:", error);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    const storedId = await getUserID();
    const storedKey = await getApiKey();

    if (!storedId) {
      setHasId(false);
      setLoading(false);
      return;
    }

    const activeKey = storedKey || process.env.BASE_FT_API || "";

    // Parallel fetch for all three datasets
    await Promise.all([
      fetchRandomDevlogs(),
      fetchGlobalProjects(activeKey),
      fetchGlobalUsers(activeKey)
    ]);
    
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <ImageBackground 
      source={require("@/assets/BG.webp")} 
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center pt-20">
        <Text className="text-3xl text-white bg-[#313244] py-2 px-10 rounded-[10px] mb-6" style={{ fontFamily: "Jua_400Regular" }}>
          Explore
        </Text>

        <View className="flex-row bg-[#313244] w-[85%] rounded-[10px] p-1 mb-6">
          {['projects', 'devlogs', 'users'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-[8px] ${activeTab === tab ? 'bg-[#ff8c00]' : ''}`}
            >
              <Text 
                className={`text-center capitalize ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}
                style={{ fontFamily: "Jua_400Regular" }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- CONTENT AREA --- */}
        {loading ? (
          <ActivityIndicator size="large" color="#ff8c00" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView 
            className="flex-1 w-full px-11"
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 40, gap: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'devlogs' && devlogs.map((log, index) => (
              <ExplorePageProjectDevlogCard 
                key={log.id || index} 
                username={log.user?.name || "Member"}
                time={new Date(log.created_at).toLocaleDateString()}
                timeLogged={`${log.total_hours}h`} 
                description={log.body} 
              />
            ))}

            {activeTab === 'projects' && projects.map((project) => (
              <View key={project.id} className="bg-[#313244] p-5 rounded-2xl border border-white/10">
                <View className="flex-row justify-between items-center mb-2">
                   <Text className="text-[#ff8c00] text-xl" style={{ fontFamily: "Jua_400Regular" }}>{project.title}</Text>
                   <View className="bg-[#ff8c00]/20 px-2 py-1 rounded-md">
                      <Text className="text-[#ff8c00] text-xs uppercase font-bold">{project.ship_status}</Text>
                   </View>
                </View>
                <Text className="text-gray-300 text-sm leading-5">{project.description}</Text>
                <Text className="text-gray-500 text-[10px] mt-4">Shipped on {new Date(project.created_at).toLocaleDateString()}</Text>
              </View>
            ))}

            {activeTab === 'users' && users.map((u) => (
              <View key={u.id} className="bg-[#313244] p-4 rounded-xl flex-row justify-between items-center border border-white/5">
                <View>
                  <Text className="text-white text-lg" style={{ fontFamily: "Jua_400Regular" }}>{u.display_name}</Text>
                  <Text className="text-gray-500 text-xs">@{u.slack_id}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-white text-lg " style={{ fontFamily: "Jua_400Regular" }}>{u.cookies ? u.cookies : 0} 🍪</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}