import { View, Text, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

import { images } from "../../constants";

const ExpertDashboard = () => {
  return (
    <SafeAreaView>
    <ScrollView>
      <View className="flex px-4 space-y-6 bg-primary">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="text-2xl font-psemibold text-white">
              HungerBusters
            </Text>
          </View>

          <View className="mt-1.5">
            <Image
              source={images.logo}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </View>
        </View>
        </View>
        
        <View className="w-full justify-center min-h-[85vh] px-4">
        <Text className="text-2xl text-black text-semibold font-psemibold">Expert Dashboard</Text>
        </View>
        
      </ScrollView>
</SafeAreaView>
  )
}

export default ExpertDashboard