import { getApiKey } from "@/lib/authStore";
import * as Haptics from 'expo-haptics';
import React, { useState } from "react";
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
    const [isSaving, setIsSaving] = useState(false);
    
    // Form State based on your Schema
    const [form, setForm] = useState({
        title: "",
        description: "",
        repo_url: "",
        demo_url: "",
        banner_url: "",
        ai_declaration: "I used AI to help with the boilerplate and logic debugging." 
    });

    const handleShip = async () => {
        // Basic Validation
        if (!form.title || !form.description) {
            Alert.alert("Wait!", "Title and Description are required to ship.");
            return;
        }

        setIsSaving(true);
        try {
            const token = await getApiKey();
            
            const response = await fetch("https://flavortown.hackclub.com/api/v1/projects", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    repo_url: form.repo_url,
                    demo_url: form.demo_url,
                    banner_url: form.banner_url || null,
                    ai_declaration: form.ai_declaration,
                    ship_status: "shipped" // Defaulting to shipped for the sidequest
                })
            });

            if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("🚀 Shipped!", "Your project is now live in Flavortown.");
                // Clear form
                setForm({ title: "", description: "", repo_url: "", demo_url: "", banner_url: "", ai_declaration: "" });
            } else {
                const errData = await response.json();
                Alert.alert("Error", errData.message || "Failed to ship project.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to Flavortown.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ImageBackground 
            source={require("@/assets/BG.webp")} 
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 items-center pt-20">
                <Text className="text-3xl text-white bg-[#313244] py-2 px-10 rounded-[10px]" style={{ fontFamily: "Jua_400Regular" }}>
                    New Ship
                </Text>
                
                <ScrollView 
                    className="flex-1 w-full px-11"
                    contentContainerStyle={{ paddingTop: 40, paddingBottom: 40, gap: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Project Title */}
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

                    {/* Description - Multi-line */}
                    <View className="bg-[#303143] rounded-[20px] p-5">
                        <Text className="text-white mb-2" style={{ fontFamily: "Jua_400Regular" }}>Description</Text>
                        <TextInput
                            placeholder="What did you build?"
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={4}
                            onChangeText={(text) => setForm({...form, description: text})}
                            value={form.description}
                            className="text-white"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    {/* Repo URL */}
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

                    {/* Banner Image URL */}
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

                    {/* Ship Button */}
                    <TouchableOpacity 
                        onPress={handleShip}
                        disabled={isSaving}
                        className={`mt-5 py-4 rounded-[15px] items-center ${isSaving ? 'bg-gray-500' : 'bg-green-600'}`}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-[20px]" style={{ fontFamily: "Jua_400Regular" }}>
                                Ship to Flavortown 🚀
                            </Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </ImageBackground>
    );
};

export default NewProject;