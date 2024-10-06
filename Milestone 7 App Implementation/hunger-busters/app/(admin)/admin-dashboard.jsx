import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';

const AdminDashboard = () => {
  return (
    <View className="flex-1 bg-gray-100 p-5">

       {/* Header Section */}
       <View className="flex-row items-center mb-6 pl-10">
        <MaterialIcons name="admin-panel-settings" size={40} color="blue" />
        <Text className="text-3xl font-extrabold ml-2 text-gray-800">Admin Dashboard</Text>
      </View>

      {/* Welcome Text */}
      <Text className="text-lg text-center text-gray-600 mb-4">
        Manage your donation requests efficiently.
      </Text>

      <View className="bg-white  rounded-3xl p-6 shadow-lg w-full max-w-md mx-auto">
          <TouchableOpacity
            className="flex-row items-center justify-between bg-green-400 py-4 px-6 rounded-lg w-full active:bg-green-500"
            onPress={() => router.push('/donation-requests')}
          >
            <Text className="text-white text-lg font-semibold">Donation Requests</Text>
            <MaterialIcons name="attach-money" size={24} color="white" />
          </TouchableOpacity>
        </View>

    </View>
  );
};

export default AdminDashboard;
