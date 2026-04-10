import ExplorePageProjectDevlogCard from "@/components/ExplorePageProjectDevlogCard";
import { getApiKey } from "@/lib/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Project {
  id: number;
  title: string;
  description: string;
  ship_status: string;
  created_at: string;
}

interface User {
  id: number;
  slack_id: string;
  display_name: string;
  avatar: string;
  cookies: number | null;
}

export default function Explore() {
  const [activeTab, setActiveTab] = useState<'projects' | 'devlogs' | 'users'>('devlogs');
  const [devlogs, setDevlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectPage, setProjectPage] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const router = useRouter();

  const getHeaders = async () => {
    const storedKey = await getApiKey();
    const activeKey = storedKey || process.env.BASE_FT_API || "";
    return { "Authorization": `Bearer ${activeKey}` };
  };

  const fetchRandomDevlogs = async () => {
    try {
      const response = await fetch('http://ftpdb.jam06452.uk/api/random_devlogs');
      const data = await response.json();
      setDevlogs(data);
    } catch (e) { console.error("Devlog error:", e); }
  };

  const fetchProjects = async (page: number) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`https://flavortown.hackclub.com/api/v1/projects?page=${page}&limit=10`, { headers });
      const data = await response.json();
      
      if (data.projects && data.projects.length > 0) {
        setProjects(prev => page === 1 ? data.projects : [...prev, ...data.projects]);
        setHasMoreProjects(data.pagination.next_page !== null);

      } else {
        setHasMoreProjects(false);
      }
    } catch (e) { console.error("Project error:", e); }
  };

  const fetchUsers = async (page: number) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`https://flavortown.hackclub.com/api/v1/users?page=${page}&limit=20`, { headers });
      const data = await response.json();
      
      if (data.users && data.users.length > 0) {
        setUsers(prev => page === 1 ? data.users : [...prev, ...data.users]);
        setHasMoreUsers(data.pagination.next_page !== null);
      } else {
        setHasMoreUsers(false);
      }
    } catch (e) { console.error("User error:", e); }
  };

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchRandomDevlogs(), fetchProjects(1), fetchUsers(1)]);
    setLoading(false);
  };

  const handleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isFetchingMore || loading) return;

    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isCloseToBottom) {
      if (activeTab === 'projects' && hasMoreProjects) {
        setIsFetchingMore(true);
        const nextPage = projectPage + 1;
        await fetchProjects(nextPage);
        setProjectPage(nextPage);
        setIsFetchingMore(false);
      } else if (activeTab === 'users' && hasMoreUsers) {
        setIsFetchingMore(true);
        const nextPage = userPage + 1;
        await fetchUsers(nextPage);
        setUserPage(nextPage);
        setIsFetchingMore(false);
      }
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  return (
    <ImageBackground source={require("@/assets/BG.webp")} className="flex-1" resizeMode="cover">
      <View className="flex-1 items-center pt-20">
        <Text className="text-3xl text-white bg-card py-2 px-10 rounded-[10px] mb-6" style={{ fontFamily: "Jua_400Regular" }}>
          Explore
        </Text>

        <View className="flex-row bg-card w-[85%] rounded-[10px] p-1 mb-6">
          {['projects', 'devlogs', 'users'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-[8px] ${activeTab === tab ? 'bg-[#ff8c00]' : ''}`}
            >
              <Text className={`text-center capitalize ${activeTab === tab ? 'text-white' : 'text-gray-400'}`} style={{ fontFamily: "Jua_400Regular" }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ff8c00" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView 
            className="flex-1 w-full px-11"
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 60, gap: 20 }}
            onScroll={handleScroll}
            scrollEventThrottle={400}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'devlogs' && devlogs.map((log, index) => (
              <ExplorePageProjectDevlogCard 
                key={log.id || index} 
                username={log.user_display_name || "Member"}
                time={new Date(log.created_at).toLocaleDateString()}
                timeLogged={`${log.total_hours}h`} 
                description={log.body} 
                project={log.project_title || "Project"}
                id={log.project_id}
              />
            ))}

            {activeTab === 'projects' && projects.map((project) => (
              <View key={project.id} className="bg-card p-5 rounded-2xl border border-white/10">
                <View className="flex-col gap-2 mb-2">
                   <TouchableOpacity onPress={() => router.push({ pathname: `/project/${project.id}` as any })}><Text className="text-white text-xl" style={{ fontFamily: "Jua_400Regular" }}>{project.title}</Text></TouchableOpacity>
                   <View className="bg-[#ff8c00]/20 px-2 py-1 rounded-md">
                      <Text className="text-white text-xs uppercase font-bold">{project.ship_status}</Text>
                   </View>
                </View>
                <Text className="text-gray-300 text-sm leading-5">{project.description}</Text>
                <Text className="text-gray-500 text-[10px] mt-4">Created on {new Date(project.created_at).toLocaleDateString()}</Text>
              </View>
            ))}

            {activeTab === 'users' && users.map((u) => (
              <View key={u.id} className="bg-card p-4 rounded-xl flex-row justify-between items-center border border-white/5">
                <View>
                  <TouchableOpacity 
                      onPress={() => router.push(`/users/${u.id}` as any)}
                      className="text-white text-lg"
                  >
                      <Text className="text-red-500 text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>
                          {u.display_name || "Unknown Hacker"}
                      </Text>
                  </TouchableOpacity>
                  <Text className="text-gray-500 text-xs">@{u.slack_id}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-white text-lg" style={{ fontFamily: "Jua_400Regular" }}>{u.cookies ?? 0} 🍪</Text>
                </View>
              </View>
            ))}

            {isFetchingMore && (
              <View className="py-4">
                <ActivityIndicator size="small" color="#ff8c00" />
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}