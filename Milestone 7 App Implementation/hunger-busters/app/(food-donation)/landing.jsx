import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import TransparentTopBar from "../../components/TransparentTopBar";
const FoodDonationLanding = () => {
  const router = useRouter();
  const handleBackPress = () => {
    router.push("/home");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <TransparentTopBar
        title="Food Listing"
        onBackPress={handleBackPress}
      />
      <View className="p-4">
        <Text className="text-3xl text-white font-bold mb-6">Food Donations</Text>
        
        {/* Button to navigate to List Surplus Food Page */}
        <TouchableOpacity
          className="bg-yellow-200 p-4 rounded-lg mb-4"
          onPress={() => router.push('/list-surplus-food')}
        >
          <Text className="text-lg text-center">List Surplus Food</Text>
        </TouchableOpacity>

        {/* Button to navigate to All Listings Page */}
        <TouchableOpacity
          className="bg-yellow-200 p-4 rounded-lg"
          onPress={() => router.push('/all-listings')}
        >
          <Text className="text-lg text-center">View All Listings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FoodDonationLanding;
