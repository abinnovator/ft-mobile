import ExplorePageProjectDevlogCard from "@/components/ExplorePageProjectDevlogCard";
import { getApiKey } from "@/lib/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ImageBackground, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Explore() {
  const [activeTab, setActiveTab] = useState<'projects' | 'devlogs' | 'users'>('devlogs');
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const [devlogs, setDevlogs] = useState<any[]>([]);
  const [devlogPage, setDevlogPage] = useState(1);
  const [hasMoreDevlogs, setHasMoreDevlogs] = useState(true);

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

  const fetchData = async (type: string, page: number, query: string = "") => {
    try {
      const headers = await getHeaders();
      let url = "";
      
      if (type === 'devlogs') {
        url = `https://flavortown.hackclub.com/api/v1/devlogs?page=${page}&limit=10${query ? `&query=${query}` : ""}`;
      } else if (type === 'projects') {
        url = `https://flavortown.hackclub.com/api/v1/projects?page=${page}&limit=10${query ? `&query=${query}` : ""}`;
      } else {
        url = `https://flavortown.hackclub.com/api/v1/users?page=${page}&limit=20${query ? `&query=${query}` : ""}`;
      }

      const response = await fetch(url, { headers });
      const data = await response.json();

      if (type === 'devlogs') {
        const newLogs = data.devlogs || [];
        setDevlogs(prev => page === 1 ? newLogs : [...prev, ...newLogs]);
        setHasMoreDevlogs(data.pagination?.next_page !== null);
      } else if (type === 'projects') {
        const newProjects = data.projects || [];
        setProjects(prev => page === 1 ? newProjects : [...prev, ...newProjects]);
        setHasMoreProjects(data.pagination?.next_page !== null);
      } else {
        const newUsers = data.users || [];
        setUsers(prev => page === 1 ? newUsers : [...prev, ...newUsers]);
        setHasMoreUsers(data.pagination?.next_page !== null);
      }
    } catch (e: any) {
      console.error(`${type} fetch error:`, e);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      setDevlogPage(1);
      setProjectPage(1);
      setUserPage(1);
      fetchData(activeTab, 1, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const loadMore = () => {
    if (isFetchingMore || loading) return;

    if (activeTab === 'devlogs' && hasMoreDevlogs) {
      setIsFetchingMore(true);
      fetchData('devlogs', devlogPage + 1, searchQuery);
      setDevlogPage(prev => prev + 1);
    } else if (activeTab === 'projects' && hasMoreProjects) {
      setIsFetchingMore(true);
      fetchData('projects', projectPage + 1, searchQuery);
      setProjectPage(prev => prev + 1);
    } else if (activeTab === 'users' && hasMoreUsers) {
      setIsFetchingMore(true);
      fetchData('users', userPage + 1, searchQuery);
      setUserPage(prev => prev + 1);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (activeTab === 'devlogs') {
      return (
        <ExplorePageProjectDevlogCard 
          username={item.user_display_name || "Member"}
          time={new Date(item.created_at).toLocaleDateString()}
          timeLogged={`${(item.duration_seconds / 3600).toFixed(1)}h`} 
          description={item.body} 
          project={item.project_title || "Project"}
          id={item.project_id}
        />
      );
    }
    if (activeTab === 'projects') {
      return (
        <View className="bg-card p-5 rounded-2xl border border-white/10 mb-4">
          <TouchableOpacity onPress={() => router.push({ pathname: `/project/${item.id}` as any })}>
            <Text className="text-white text-xl" style={{ fontFamily: "Jua_400Regular" }}>{item.title}</Text>
          </TouchableOpacity>
          <View className="bg-accent/20 self-start px-2 py-1 rounded-md mt-1">
            <Text className="text-white text-xs uppercase font-bold">{item.ship_status}</Text>
          </View>
          <Text className="text-gray-300 text-sm mt-2">{item.description}</Text>
        </View>
      );
    }
    return (
      <View className="bg-card p-4 rounded-xl flex-row justify-between items-center border border-white/5 mb-4">
        <TouchableOpacity onPress={() => router.push(`/users/${item.id}` as any)}>
          <Text className="text-accent text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>{item.display_name || "Hacker"}</Text>
          <Text className="text-gray-500 text-xs">@{item.slack_id}</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg" style={{ fontFamily: "Jua_400Regular" }}>{item.cookies ?? 0} 🍪</Text>
      </View>
    );
  };

  return (
    <ImageBackground source={require("@/assets/BG.webp")} className="flex-1" resizeMode="cover">
      <View className="flex-1 items-center pt-20">
        <Text className="text-3xl text-white bg-card py-2 px-10 rounded-[10px] mb-4" style={{ fontFamily: "Jua_400Regular" }}>Explore</Text>

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
              onPress={() => { setActiveTab(tab as any); setLoading(true); }}
              className={`flex-1 py-2 rounded-[8px] ${activeTab === tab ? 'bg-accent' : ''}`}
            >
              <Text className={`text-center capitalize ${activeTab === tab ? 'text-white' : 'text-gray-400'}`} style={{ fontFamily: "Jua_400Regular" }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ec8b34" />
        ) : (
          <FlatList
            data={activeTab === 'devlogs' ? devlogs : activeTab === 'projects' ? projects : users}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 100 }}
            className="w-full"
            ListFooterComponent={isFetchingMore ? <ActivityIndicator color="#ec8b34" className="py-4" /> : null}
          />
        )}
      </View>
    </ImageBackground>
  );
}