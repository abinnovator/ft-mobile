import ExplorePageProjectDevlogCard from "@/components/ExplorePageProjectDevlogCard";
import React, { useEffect, useState } from "react"; // 1. Import hooks
import { ActivityIndicator, ImageBackground, ScrollView, Text, View } from "react-native";

// 2. Remove 'async' from the main function
export default function Explore() {
  const [devlogs, setDevlogs] = useState([]); // 3. State to store logs
  const [loading, setLoading] = useState(true); // 4. Loading state

  const fetchRandomDevlogs = async () => {
    try {
      const response = await fetch('http://ftpdb.jam06452.uk/api/random_devlogs'); 
      const data = await response.json();
      setDevlogs(data); // 5. Update state with real data
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomDevlogs();
  }, []); 

  return (
    <ImageBackground 
      source={require("@/assets/BG.webp")} 
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 items-center pt-20">
        <Text className="text-3xl text-white bg-[#313244] py-2 px-10 rounded-[10px]" style={{ fontFamily: "Jua_400Regular" }}>
          Explore
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ff8c00" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView 
            className="flex-1 w-full px-11"
            contentContainerStyle={{ paddingTop: 80, paddingBottom: 40, gap: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {devlogs.map((log, index) => (
              <ExplorePageProjectDevlogCard 
                key={log.id || index} 
                username={log.user?.name || "Member"} // Adjust based on if 'user' is an object
                time={new Date(log.created_at).toLocaleDateString()} // Formats ISO string to readable date
                timeLogged={`${log.total_hours}h`} 
                // title={log.project_name || "New Ship"} 
                description={log.body} // Using 'body' from your JSON
                // image={log.media_urls?.[0]} // Pass the first image if it exists
                // comments={log.comments_count || 0}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}