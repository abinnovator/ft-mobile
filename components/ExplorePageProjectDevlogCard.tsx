import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ExplorePageProjectCard = ({username, time, timeLogged, description, project, id, profilePic}: {username: string, time: string, timeLogged: string, description: string, project: string, id: string, profilePic: string}) => {
    const router = useRouter();
    return (
        <View>
            <View className="pt-2 pb-5 px-5 bg-card rounded-[20px]">
                <View className="flex flex-row">
                    <View className="flex flex-col">
                        <View className="flex flex-row gap-4">
                            <Image src={profilePic} className='w-10 h-10 rounded-full' />
                            <Text className="text-white text-[16px] truncate max-w-[80%]" style={{ fontFamily: "Jua_400Regular" }}>{username} worked on {project}</Text>
                        </View>
                        <Text className="text-white text-[10px]" style={{ fontFamily: "Jua_400Regular" }}>{time} ago</Text>
                        <Text className="text-white text-[10px]" style={{ fontFamily: "Jua_400Regular" }}>{timeLogged} time logged</Text>

                    </View>
                </View>
                <View className="pt-3">
                    {/* <Text className="text-white text-[18px]" style={{ fontFamily: "Jua_400Regular" }}>{title}</Text> */}
                    <TouchableOpacity onPress={() => router.push({ pathname: `/project/${id}` as any })}><Text className="text-white text-[16px]" style={{ fontFamily: "Jua_400Regular" }}>{description}</Text></TouchableOpacity>

                </View>
            </View>
        </View>
    );
};

export default ExplorePageProjectCard;