import NoKey from "@/components/NoKey";
import { getApiKey, getUserID } from "@/lib/authStore";
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const NewProject = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const isEditing = !!id;

    const [isSaving, setIsSaving] = useState(false);
    const [hasAuth, setHasAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        description: "",
        repo_url: "",
        demo_url: "",
        banner_url: "",
        ai_declaration: "I used AI to help with the boilerplate and logic debugging."
    });

    useEffect(() => {
        const preparePage = async () => {
            try {
                const key = await getApiKey();
                const userId = await getUserID();

                if (key && userId) {
                    setHasAuth(true);
                    
                    if (isEditing) {
                        const response = await fetch(`https://flavortown.hackclub.com/api/v1/projects/${id}`, {
                            headers: { "Authorization": `Bearer ${key}` }
                        });
                        const data = await response.json();
                        if (response.ok) {
                            setForm({
                                title: data.title || "",
                                description: data.description || "",
                                repo_url: data.repo_url || "",
                                demo_url: data.demo_url || "",
                                banner_url: data.banner_url || "",
                                ai_declaration: data.ai_declaration || form.ai_declaration
                            });
                        }
                    }
                }
            } catch (e) {
                console.error("Preparation failed", e);
            } finally {
                setLoading(false);
            }
        };

        preparePage();
    }, [id]);

    const handleShip = async () => {
        if (!form.title || !form.description) {
            Alert.alert("Wait!", "Title and Description are required.");
            return;
        }

        setIsSaving(true);
        try {
            const token = await getApiKey();
            const url = isEditing 
                ? `https://flavortown.hackclub.com/api/v1/projects/${id}` 
                : "https://flavortown.hackclub.com/api/v1/projects";
            
            const response = await fetch(url, {
                method: isEditing ? "PATCH" : "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...form,
                    banner_url: form.banner_url || null,
                    ship_status: "shipped"
                })
            });

            if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                    isEditing ? "Updated!" : "🚀 Shipped!", 
                    isEditing ? "Your changes are live." : "Your project is now live in Flavortown."
                );
                router.replace("/explore"); // Go to explore to see the new/updated card
            } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                const errData = await response.json();
                Alert.alert("Error", errData.message || "Action failed.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to Flavortown.");
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) {
        return (
            <ImageBackground source={require("@/assets/BG.webp")} className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#ff8c00" />
            </ImageBackground>
        );
    }

    if (!hasAuth) {
        return <NoKey />;
    }

    return (
        <ImageBackground source={require("@/assets/BG.webp")} className="flex-1" resizeMode="cover">
            <View className="flex-1 items-center pt-20">
                <Text className="text-3xl text-white bg-[#313244] py-2 px-10 rounded-[10px]" style={{ fontFamily: "Jua_400Regular" }}>
                    {isEditing ? "Edit Project" : "New Project"}
                </Text>
                
                <ScrollView 
                    className="flex-1 w-full px-11"
                    contentContainerStyle={{ paddingTop: 40, paddingBottom: 40, gap: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="bg-[#303143] rounded-[20px] p-5">
                        <Text className="text-white mb-2" style={{ fontFamily: "Jua_400Regular" }}>Project Title</Text>
                        <TextInput
                            placeholder="e.g. Surfer AI"
                            placeholderTextColor="#666"
                            onChangeText={(text) => setForm({...form, title: text})}
                            value={form.title}
                            className="text-white text-lg"
                        />
                    </View>

                    <View className="bg-[#303143] rounded-[20px] p-5">
                        <Text className="text-white mb-2" style={{ fontFamily: "Jua_400Regular" }}>Description</Text>
                        <TextInput
                            placeholder="What did you build?"
                            placeholderTextColor="#666"
                            multiline
                            onChangeText={(text) => setForm({...form, description: text})}
                            value={form.description}
                            className="text-white"
                            style={{ textAlignVertical: 'top', minHeight: 80 }}
                        />
                    </View>

                    <View className="bg-[#303143] rounded-[20px] p-5">
                        <Text className="text-white mb-2" style={{ fontFamily: "Jua_400Regular" }}>Github URL</Text>
                        <TextInput
                            placeholder="https://github.com/..."
                            placeholderTextColor="#666"
                            onChangeText={(text) => setForm({...form, repo_url: text})}
                            value={form.repo_url}
                            className="text-white"
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="bg-[#303143] rounded-[20px] p-5">
                        <Text className="text-white mb-2" style={{ fontFamily: "Jua_400Regular" }}>Banner Image URL</Text>
                        <TextInput
                            placeholder="https://..."
                            placeholderTextColor="#666"
                            onChangeText={(text) => setForm({...form, banner_url: text})}
                            value={form.banner_url}
                            className="text-white"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={handleShip}
                        disabled={isSaving}
                        className={`mt-5 py-4 rounded-[15px] items-center ${isSaving ? 'bg-gray-500' : 'bg-green-600'}`}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-[20px]" style={{ fontFamily: "Jua_400Regular" }}>
                                {isEditing ? "Save Changes " : "Ship to Flavortown "}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => router.back()}
                        disabled={isSaving}
                        className="mt-2 py-4 rounded-[15px] items-center border border-red-500"
                    >
                        <Text className="text-red-500 text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </ImageBackground>
    );
};

export default NewProject;