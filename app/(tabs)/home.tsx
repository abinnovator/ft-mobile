import { getApiKey, getUserID } from "@/lib/authStore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ImageBackground, Text, View } from "react-native";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [hasId, setHasId] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const storedId = await getUserID();
      const storedKey = await getApiKey();

      if (!storedId) {
        setHasId(false);
        setLoading(false);
        return;
      }

      const activeKey = storedKey || process.env.BASE_FT_API || "";

      const response = await fetch(`https://flavortown.hackclub.com/api/v1/users/${storedId}`, {
        headers: {
          "Authorization": `Bearer ${activeKey}`
        }
      }); 
      
      const data = await response.json();
      setUser(data);
      setHasId(true);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const renderValue = (value: any, suffix: string = "") => {
    if (!hasId) return "No User ID";
    if (loading && !user) return "...";
    return `${value ?? 0}${suffix}`;
  };

  return (
    <ImageBackground 
      source={require("@/assets/BG.webp")} 
      className="flex flex-col items-center pt-20 text-white h-screen w-screen"
      resizeMode="cover"
    >
      <Text className="text-3xl text-white bg-card py-2 px-10 rounded-[10px]" style={{ fontFamily: "Jua_400Regular" }}>Kitchen</Text>
      
      <View className="py-11 px-12">
        <View className="bg-card rounded-lg flex flex-col justify-center text-center text-white pt-7 pb-16 px-9">
          <Text className="text-2xl text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>Hack club X Open Sauce</Text>
          <Text className="text-lg text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>New items available</Text>
        </View>
      </View>

      <View className="gap-5 flex flex-col">
        <View className="flex flex-row gap-2 px-6">
          <View className="bg-card rounded-lg flex flex-col justify-center text-center text-white pt-7 pb-8 px-6 gap-6 w-[176px] min-h-[102px]">
            <Text className="text-[16px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>Your Cookies</Text>
            <Text className="text-[14px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>
              {renderValue(user?.cookies, " 🍪")}
            </Text>
          </View>

          <View className="bg-card rounded-lg flex flex-col justify-center text-center text-white pt-7 pb-8 px-6 gap-6 w-[176px] min-h-[102px]">
            <Text className="text-[16px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>Achievements</Text>
            <Text className="text-[14px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>
              {renderValue(user?.achievements?.length, " 🏆")}
            </Text>
          </View>
        </View>

        <View className="flex flex-row gap-2 px-6">
          <View className="bg-card rounded-lg flex flex-col justify-center text-center text-white pt-7 pb-8 px-6 gap-6 w-[176px] min-h-[102px]">
            <Text className="text-[16px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>Time today</Text>
            <Text className="text-[14px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>
              {renderValue((user?.devlog_seconds_today / 3600).toFixed(2), " hrs")}
            </Text>
          </View>

          <View className="bg-card rounded-lg flex flex-col justify-center text-center text-white pt-7 pb-8 px-6 gap-6 w-[176px] min-h-[102px]">
            <Text className="text-[16px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>Total Time</Text>
            <Text className="text-[14px] text-white text-center" style={{ fontFamily: "Jua_400Regular" }}>
              {renderValue((user?.devlog_seconds_total / 3600).toFixed(2), " hrs")}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}