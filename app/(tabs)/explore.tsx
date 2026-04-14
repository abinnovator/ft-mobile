import ExplorePageProjectDevlogCard from "@/components/ExplorePageProjectDevlogCard";
import { getApiKey } from "@/lib/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Explore() {
  const [activeTab, setActiveTab] = useState<'projects' | 'devlogs' | 'users'>('devlogs');
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const [devlogs, setDevlogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectPage, setProjectPage] = useState(1);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const getHeaders = async () => {
    const storedKey = await getApiKey();
    const activeKey = storedKey || process.env.BASE_FT_API || "";
    return { "Authorization": `Bearer ${activeKey}`, "Accept": "application/json" };
  };

  const fetchDevlogs = async (query: string = "", isMore: boolean = false) => {
    try {
      const response = await fetch(`https://ftpdb.jam06452.uk/api/random_devlogs`);
      const data = await response.json();
      
      const filtered = query 
        ? data.filter((d: any) => d.body.toLowerCase().includes(query.toLowerCase()) || d.user_display_name.toLowerCase().includes(query.toLowerCase()))
        : data;

      setDevlogs(prev => isMore ? [...prev, ...filtered] : filtered);
    } catch (e) { 
      console.error("Devlog fetch error:", e); 
    } finally { 
      setLoading(false); 
      setIsFetchingMore(false); 
    }
  };

  const fetchProjects = async (page: number, query: string = "") => {
    try {
      const headers = await getHeaders();
      const url = `https://flavortown.hackclub.com/api/v1/projects?page=${page}&limit=15${query ? `&query=${query}` : ""}`;
      const response = await fetch(url, { headers });
      const data = await response.json();

      setProjects(prev => page === 1 ? (data.projects || []) : [...prev, ...(data.projects || [])]);
      setHasMoreProjects(data.pagination?.next_page !== null);
    } catch (e) { console.error("Project fetch error:", e); }
    finally { setLoading(false); setIsFetchingMore(false); }
  };

  const fetchUsers = async (page: number, query: string = "") => {
    try {
      const headers = await getHeaders();
      const url = `https://flavortown.hackclub.com/api/v1/users?page=${page}&limit=20${query ? `&query=${query}` : ""}`;
      const response = await fetch(url, { headers });
      const data = await response.json();

      setUsers(prev => page === 1 ? (data.users || []) : [...prev, ...(data.users || [])]);
      setHasMoreUsers(data.pagination?.next_page !== null);
    } catch (e) { console.error("User fetch error:", e); }
    finally { setLoading(false); setIsFetchingMore(false); }
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === 'devlogs') fetchDevlogs(searchQuery);
      if (activeTab === 'projects') { setProjectPage(1); fetchProjects(1, searchQuery); }
      if (activeTab === 'users') { setUserPage(1); fetchUsers(1, searchQuery); }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isCloseToBottom && !isFetchingMore && !loading) {
      if (activeTab === 'devlogs') {
        setIsFetchingMore(true);
        fetchDevlogs(searchQuery, true);
      } else if (activeTab === 'projects' && hasMoreProjects) {
        setIsFetchingMore(true);
        const next = projectPage + 1;
        fetchProjects(next, searchQuery);
        setProjectPage(next);
      } else if (activeTab === 'users' && hasMoreUsers) {
        setIsFetchingMore(true);
        const next = userPage + 1;
        fetchUsers(next, searchQuery);
        setUserPage(next);
      }
    }
  };

  return (
    <ImageBackground source={require("@/assets/BG.webp")} className="flex-1" resizeMode="cover">
      <View className="flex-1 items-center pt-20">
        <Text className="text-3xl text-white bg-card py-2 px-10 rounded-[10px] mb-4" style={{ fontFamily: "Jua_400Regular" }}>
          Explore
        </Text>

        <TextInput
          placeholder="Search FlavorTown..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="bg-card w-[85%] text-white p-4 rounded-xl mb-4 border border-white/10"
          style={{ fontFamily: "Jua_400Regular" }}
        />

        <View className="flex-row bg-card w-[85%] rounded-[10px] p-1 mb-6">
          {['projects', 'devlogs', 'users'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-[8px] ${activeTab === tab ? 'bg-accent' : ''}`}
            >
              <Text className={`text-center capitalize ${activeTab === tab ? 'text-white' : 'text-gray-400'}`} style={{ fontFamily: "Jua_400Regular" }}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ec8b34" className="mt-10" />
        ) : (
          <ScrollView 
            className="w-full"
            contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 100 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {activeTab === 'devlogs' && (
              <View className="flex flex-col gap-3">
                {devlogs.map((item, index) => (
                  <ExplorePageProjectDevlogCard 
                  profilePic={item.user_avatar || "https://i0.wp.com/a.slack-edge.com/df10d/img/avatars/ava_0020-512.png?ssl=1"}
                    key={`log-${item.id}-${index}`}
                    username={item.user_display_name || "Member"}
                    time={new Date(item.created_at).toLocaleDateString()}
                    timeLogged={`${item.total_hours}h`} 
                    description={item.body} 
                    project={item.project_title || "Project"}
                    id={item.project_id}
                  />
                ))}
              </View>
            )}

            {activeTab === 'projects' && projects.map((item, index) => (
              <View key={`proj-${item.id}-${index}`} className="bg-card p-5 rounded-2xl border border-white/10 mb-4">
                <TouchableOpacity onPress={() => router.push({ pathname: `/project/${item.id}` as any })}>
                  <Text className="text-white text-xl" style={{ fontFamily: "Jua_400Regular" }}>{item.title}</Text>
                </TouchableOpacity>
                <View className="bg-accent/20 self-start px-2 py-1 rounded-md mt-1">
                  <Text className="text-white text-xs uppercase font-bold">{item.ship_status}</Text>
                </View>
                <Text className="text-gray-300 text-sm mt-2">{item.description}</Text>
              </View>
            ))}

            {activeTab === 'users' && users.map((item, index) => (
              <View key={`user-${item.id}-${index}`} className="bg-card p-4 rounded-xl flex-row justify-between items-center border border-white/5 mb-4">
                <TouchableOpacity onPress={() => router.push(`/users/${item.id}` as any)}>
                  <Text className="text-accent text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>{item.display_name || "Hacker"}</Text>
                  <Text className="text-gray-500 text-xs">@{item.slack_id}</Text>
                </TouchableOpacity>
                <Text className="text-white text-lg" style={{ fontFamily: "Jua_400Regular" }}>{item.cookies ?? 0} 🍪</Text>
              </View>
            ))}

            {isFetchingMore && <ActivityIndicator color="#ec8b34" className="py-4" />}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}