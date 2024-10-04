import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from "expo-router";

const AdminDashboard = () => {
  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-3xl font-extrabold mb-6 text-center text-gray-800">Welcome to the Admin Dashboard!</Text>
      
      <View className="bg-white rounded-3xl p-8 shadow-lg w-full max-w-md mx-auto">
        <TouchableOpacity
          className="bg-green-400 py-4 px-6 rounded-lg w-full active:bg-green-500"
          onPress={() => router.push('/donation-requests')} // Use onPress instead of handlePress
        >
          <Text className="text-white text-lg font-semibold text-center">Donation Requests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminDashboard;
