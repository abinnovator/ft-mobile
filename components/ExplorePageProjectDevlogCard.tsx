import { Text, View } from "react-native";

const ExplorePageProjectCard = ({username, time, timeLogged, title, description}: {username: string, time: string, timeLogged: string, title: string, description: string}) => {
    return (
        <View>
            <View className="pt-2 pb-5 px-5 bg-[#303143] rounded-[20px]">
                <View className="flex flex-row">
                    <View className="flex flex-col">
                        <Text className="text-white text-[16px]" style={{ fontFamily: "Jua_400Regular" }}>{username} worked on project</Text>
                        <Text className="text-white text-[10px]" style={{ fontFamily: "Jua_400Regular" }}>{time} ago</Text>
                        <Text className="text-white text-[10px]" style={{ fontFamily: "Jua_400Regular" }}>{timeLogged} time logged</Text>

                    </View>
                </View>
                <View className="pt-3">
                    {/* <Text className="text-white text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>{title}</Text> */}
                    <Text className="text-white text-[16px]" style={{ fontFamily: "Jua_400Regular" }}>{description}</Text>

                </View>
            </View>
        </View>
    );
};

export default ExplorePageProjectCard;