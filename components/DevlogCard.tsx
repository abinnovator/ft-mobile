import React from 'react'
import { Text, View } from 'react-native'

const DevlogCard = ({description, time, timeLogged, username, project}: {description: string, time: string, timeLogged: string, username: string, project: string}) => {
  return (
    <View className="bg-card p-5 rounded-2xl mt-6 border border-white/10">
        <View className="flex flex-row">
                    <View className="flex flex-col">
                        <Text className="text-white text-[16px]" style={{ fontFamily: "Jua_400Regular" }}>{username} worked on {project}</Text>
                        <Text className="text-white text-[6px]" style={{ fontFamily: "Jua_400Regular" }}>{time} ago</Text>
                        <Text className="text-white text-[6px]" style={{ fontFamily: "Jua_400Regular" }}>{timeLogged} time logged</Text>

                    </View>
                </View>
        <Text className="text-white text-lg leading-6">{description}</Text>
    </View>
  )
}

export default DevlogCard