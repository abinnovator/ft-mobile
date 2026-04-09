import { getApiKey, getUserID, saveApiKey, saveUserID } from "@/lib/authStore";
import * as Haptics from 'expo-haptics'; // Optional: for that "Apple" feel
import React, { useEffect, useState } from "react";
import {
    Alert,
    ImageBackground,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const Profile = () => {
    const [apiKey, setApiKey] = useState("");
    const [userId, setUserId] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Load credentials on mount
    useEffect(() => {
        const loadCredentials = async () => {
            const savedKey = await getApiKey();
            const savedId = await getUserID();
            if (savedKey) setApiKey(savedKey);
            if (savedId) setUserId(savedId);
        };
        loadCredentials();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save both to SecureStore
            await saveApiKey(apiKey);
            await saveUserID(userId);
            
            // Success Haptic
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            Alert.alert("Success", "Settings saved successfully!");
        } catch (error) {
            Alert.alert("Error", "Failed to save settings.");
        } finally {
            setIsSaving(false);
        }
    };
    const [user, setUser] = useState(null);
  const [hasId, setHasId] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const storedId = await getUserID();
      console.log(storedId);
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
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []); 

    return (
        <ImageBackground 
            source={require("@/assets/BG.webp")} 
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 items-center pt-20">
                <Text className="text-3xl text-white bg-[#313244] py-2 px-10 rounded-[10px]" style={{ fontFamily: "Jua_400Regular" }}>
                    Your Profile
                </Text>
                
                <ScrollView 
                    className="flex-1 w-full px-11"
                    contentContainerStyle={{ paddingTop: 80, paddingBottom: 40, gap: 25 }}
                    showsVerticalScrollIndicator={false}
                >

                    <View className="bg-[#303143] rounded-[20px] p-5 flex-row items-center gap-4">
                        <Text className="text-white text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>API Key:</Text>
                        <TextInput
                            editable
                            placeholder="Paste Key Here"
                            placeholderTextColor="#666"
                            secureTextEntry={true}
                            onChangeText={setApiKey}
                            value={apiKey}
                            className="text-white flex-1"
                        />
                    </View>

                    <View className="bg-[#303143] rounded-[20px] p-5 flex-row items-center gap-4">
                        <Text className="text-white text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>User ID:</Text>
                        <TextInput
                            editable
                            placeholder="Enter User ID"
                            placeholderTextColor="#666"
                            onChangeText={setUserId}
                            value={userId}
                            className="text-white flex-1"
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={handleSave}
                        disabled={isSaving}
                        className={`mt-5 py-4 rounded-[15px] items-center ${isSaving ? 'bg-gray-500' : 'bg-orange-500'}`}
                    >
                        <Text className="text-white text-[20px]" style={{ fontFamily: "Jua_400Regular" }}>
                            {isSaving ? "Saving..." : "Save Settings"}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </ImageBackground>
    );
};

export default Profile;