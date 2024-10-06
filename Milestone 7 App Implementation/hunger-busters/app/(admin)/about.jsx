import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

const About = () => {
  return (
    <View className="flex-1 bg-gray-100 p-5">
      {/* Header Section */}
      <View className="flex-row items-center mb-6 pl-20">
        <MaterialIcons name="info" size={40} color="blue" />
        <Text className="text-3xl font-extrabold ml-2 text-gray-800">About Us</Text>
      </View>

      {/* About Content */}
      <View className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-md mx-auto">
        <Text className="text-lg text-gray-600 mb-4">
          Welcome to our Admin Dashboard! Here, you can manage donation requests and oversee all activities efficiently.
        </Text>
        <Text className="text-lg text-gray-600 mb-4">
          Our mission is to connect donors with those in need, making the donation process seamless and transparent.
        </Text>
        <Text className="text-lg text-gray-600 mb-4">
          If you have any questions, feel free to reach out to us through the contact section of the dashboard.
        </Text>
      </View>

      {/* Navigation Button */}
      <TouchableOpacity
        className="bg-green-400 py-4 px-6 rounded-lg w-full max-w-xs mx-auto mt-6 active:bg-green-500"
        onPress={() => router.push('/admin-dashboard')} // Use onPress instead of handlePress
      >
        <Text className="text-white text-lg font-semibold text-center">Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default About;
