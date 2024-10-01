import { View, Text, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router } from "expo-router";
import React from 'react'

import { images } from "../../constants";
import CustomButton from '../../components/CustomButton';

const donationRequest = () => {
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
        
        <View className="w-full justify-center items-center min-h-[85vh] px-4">

        <Text className="text-2xl font-psemibold text-black">
              Request Donation
        </Text>

          <CustomButton title="School Donations"
          handlePress={()=> router.push('/school-donations')}
          containerStyles="w-full mt-7" 
          />

          <CustomButton title="Elder Home Donations"
          handlePress={()=> router.push('/elder-donations')}
          containerStyles="w-full mt-7" 
          />
        
        </View>
        
      </ScrollView>
</SafeAreaView>
  )
}

export default donationRequest