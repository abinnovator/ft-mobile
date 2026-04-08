
import React from "react";
import { ImageBackground, Text, View } from "react-native";

const NoKey = () => {
    return (
        <ImageBackground 
            source={require("@/assets/BG.webp")} 
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 items-center justify-center">
                <View className="bg-[#303143] rounded-[20px] p-8 items-center max-w-[80%]">
                    <Text className="text-7xl text-center mb-10">🚫</Text>
                    <Text className="text-white text-xl text-center mb-4" style={{ fontFamily: "Jua_400Regular" }}>
                        No API Key Found
                    </Text>
                    <Text className="text-gray-300 text-center mb-6" style={{ fontFamily: "Jua_400Regular" }}>
                        Please enter your FlavorTown API Key in the profile settings to continue.
                    </Text>
                    
                </View>
            </View>
        </ImageBackground>
    );
};

export default NoKey;