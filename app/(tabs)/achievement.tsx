import NoKey from "@/components/NoKey";
import { getApiKey, getUserID } from "@/lib/authStore";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Text,
    View
} from "react-native";

const Achievement = () => {
  const [hasAuth, setHasAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [achievments, setAchievments] = useState([]);
  const router = useRouter();

  const fetchMyachievments = async () => {
    try {
      const key = await getApiKey();
      const id = await getUserID();

      if (!key || !id) {
        setHasAuth(false);
        setLoading(false);
        return;
      }

      setHasAuth(true);

      const response = await fetch(`https://flavortown.hackclub.com/api/v1/users/${id}/`, {
        headers: { "Authorization": `Bearer ${key}` }
      });
      
      const data = await response.json();
      setAchievments(data.achievements || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyachievments();
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
        <Text className="text-3xl text-white bg-card py-2 px-10 rounded-[10px]" style={{ fontFamily: "Jua_400Regular" }}>
          Your Achievements
        </Text>
        
        <ScrollView 
          className="flex-1 w-full px-11"
          contentContainerStyle={{ paddingTop: 40, paddingBottom: 60, gap: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {achievments.length > 0 ? (
            achievments.map((achievement) => {
              

              return (
                <View key={achievement.slug} className="bg-[#f8e8d1] rounded-[20px] px-5 py-10">
                  <Text className="text-2xl text-[#56282f] text-center" style={{ fontFamily: "Jua_400Regular" }}>{achievement.name}</Text>
                  <Text className="text-xl text-[#56282f] text-center" style={{ fontFamily: "Jua_400Regular" }}>{achievement.description}</Text>
                </View>
              );
            })
          ) : (
            <View className="items-center py-10">
              <Text className="text-gray-400 italic">No achievements yet.</Text>
            </View>
          )}


        </ScrollView>
      </View>
    </ImageBackground>
  );
}

export default Achievement;