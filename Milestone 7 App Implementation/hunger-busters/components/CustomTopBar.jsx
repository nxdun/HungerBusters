import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur'
import { TouchableOpacity } from 'react-native-gesture-handler'
const CustomTopBar = ({ title, backClick }) => (
    <View className="p-3 shadow-sm">
    <BlurView intensity={120} tint="light" className="rounded-b-3xl p-4">
      <View className="flex-row justify-center items-center">
        <TouchableOpacity onPress={() => router.push("/expert-dashboard")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          className="text-xl font-bold text-black flex-1 text-center"
          onPress={backClick}
        >
          {title}
        </Text>
      </View>
    </BlurView>
    </View>
  )

export default CustomTopBar

