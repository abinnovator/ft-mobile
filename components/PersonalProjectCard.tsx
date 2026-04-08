import { Image, Text, View } from "react-native";

const PersonalProjectCard = ({title, description, image}: {title: string, description: string, image: string}) => {
    return (
        <View className="py-3 px-3 rounded-[20px] bg-[#303143]">
            <Image source={{uri: image}} className="w-[289px] h-[157px] rounded-[10px]" />

            <Text className="text-white text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>{title}</Text>
            <Text className="text-white text-[10px]" style={{ fontFamily: "Jua_400Regular" }}>{description}</Text>
        </View>
    );
};

export default PersonalProjectCard;