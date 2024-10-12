import { View, Text, Image, ScrollView , TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, router } from "expo-router";
import React from 'react'
import AppGradient from "@/components/AppGradient";
import { Ionicons } from '@expo/vector-icons';
import { images } from "../../constants";
import CustomButton from '../../components/CustomButton';
import TransparentTopBar from '../../components/TransparentTopBar';

const donationRequest = () => {
  const handleBackPress = () => {
    router.push("/donations");
  };
  
  return (
    <AppGradient
          // Background Linear Gradient
          colors={["#161b2e", "#0a4d4a", "#766e67"]}
        >
          <TransparentTopBar
        title="Donation Request"
        onBackPress={handleBackPress}
      />
        
        
        <View className="w-full justify-center items-center min-h-[85vh] px-4">

        <Text className="text-center text-white font-bold text-4xl">
              Request <Text className="text-secondary-200">Donations</Text>
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
        </AppGradient>
  )
}

export default donationRequest