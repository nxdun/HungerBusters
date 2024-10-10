import { View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing session data
import { useRouter } from 'expo-router'; // For navigation
import AppGradient from "@/components/AppGradient";
import { Ionicons } from '@expo/vector-icons'; // Import icons

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  // Retrieve user details from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRole = await AsyncStorage.getItem('userRole');
        const userToken = await AsyncStorage.getItem('userToken');
        const userEmail = await AsyncStorage.getItem('userEmail');
        const username = await AsyncStorage.getItem('username');

        // If all user data is available, set it in state
        if (userToken && userRole && userEmail && username) {
          setUserDetails({
            role: userRole,
            email: userEmail,
            username: username,
          });
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Log out functionality
  const handleLogout = async () => {
    try {
      // Clear user session (remove userToken and userRole)
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('username');

      // Redirect to the login screen after logging out
      router.replace('/sign-in');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <AppGradient
      // Background Linear Gradient
      colors={["#161b2e", "#0a4d4a", "#766e67"]}
    >
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-2xl font-semibold mb-5 text-white">Profile</Text>

        {userDetails ? (
          <View className="bg-white rounded-lg p-4 shadow-md w-full max-w-md">
            <View className="flex-row items-center mb-4">
              <Ionicons name="person-outline" size={24} color="#4a4a4a" />
              <Text className="ml-2 text-lg text-gray-800">Username: {userDetails.username}</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="mail-outline" size={24} color="#4a4a4a" />
              <Text className="ml-2 text-lg text-gray-800">Email: {userDetails.email}</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="shield-checkmark-outline" size={24} color="#4a4a4a" />
              <Text className="ml-2 text-lg text-gray-800">Role: {userDetails.role}</Text>
            </View>
          </View>
        ) : (
          <Text className="text-lg text-gray-300">Loading user details...</Text>
        )}

        <View className="mt-6 w-full max-w-sm">
          <Button title="Log Out" onPress={handleLogout} color="#ff6b6b" />
        </View>
      </View>
    </AppGradient>
  );
};

export default Profile;
