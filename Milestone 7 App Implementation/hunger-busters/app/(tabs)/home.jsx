import { View, Text, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { Redirect, router } from "expo-router";

import { images } from "../../constants";
import CustomButton from '../../components/CustomButton';

const Home = () => {


  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex px-4 space-y-6 bg-primary">
          <View className="flex justify-between items-start flex-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome To
              </Text>
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
          
            {/* Grid containing 4 buttons */}
        <View className="flex flex-wrap flex-row justify-between">

        <CustomButton title="Donations"
          handlePress={()=> router.push('/donations')}
          containerStyles="w-[180px] h-[200px] bg-teal-400 rounded-xl shadow-md m-2" 
          />

          <CustomButton title="Experts"
          handlePress={()=> router.push('#')}
          containerStyles="w-[180px] h-[200px] bg-sky-950 text-white rounded-xl shadow-md m-2" 
          />
          <CustomButton title="Health"
          handlePress={()=> router.push('#')}
          containerStyles="w-[180px] h-[200px] bg-yellow-200 rounded-xl shadow-md m-2" 
          />
          <CustomButton title="Information"
          handlePress={()=> router.push('#')}
          containerStyles="w-[180px] h-[200px] bg-red-400 rounded-xl shadow-md m-2" 
          />
    
        </View>
          
        </ScrollView>
  </SafeAreaView>
  )
}

export default Home