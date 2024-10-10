import { View, Text, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router } from "expo-router";
import React from 'react'

import { images } from "../../constants";
import CustomButton from '../../components/CustomButton';
import AppGradient from "@/components/AppGradient";

const Donations = () => {
  return (
    <View className="flex-1">
    <AppGradient
          // Background Linear Gradient
          colors={["#161b2e", "#0a4d4a", "#766e67"]}
    >
      <View className="mb-6">
      <Text className="text-3xl font-bold text-center text-white">
              Welcome to<Text className="text-secondary-200"> Hunger Busters</Text>
            </Text>
        </View>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">

        <Text className="text-center text-white font-bold text-4xl">
              Donations
        </Text>

          <CustomButton title="Donate"
          handlePress={()=> router.push('/donate')}
          containerStyles="w-full mt-7" 
          />

          <CustomButton title="Request Donation"
          handlePress={()=> router.push('/donation-request')}
          containerStyles="w-full mt-7" 
          />
        
        </View>
        </AppGradient>
        </View>
  )
}

export default Donations