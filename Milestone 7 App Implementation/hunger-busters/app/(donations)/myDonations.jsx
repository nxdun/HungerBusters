import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AppGradient from "@/components/AppGradient";

const MyDonations = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const email = await AsyncStorage.getItem('userEmail'); // Fetch the user's email
  
        if (!token) {
          setError('User not logged in');
          setLoading(false);
          return;
        }
  
        if (!email) {
          setError('Email is required');
          setLoading(false);
          return;
        }
  
        const response = await axios.get(`${apiUrl}/api/v1/user/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { email }, // Pass the email as query parameter
        });
        
        setSubscriptions(response.data); // Adjust this if your backend response structure is different
      } catch (err) {
        console.error('Error in fetchUserSubscriptions:', err); // Log the error for debugging
        setError('Failed to fetch subscriptions');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserSubscriptions();
  }, []);

  if (loading) {
    return (
      <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-lg text-white mt-2">Loading subscriptions...</Text>
        </View>
      </AppGradient>
    );
  }

  if (error) {
    return (
      <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-red-500">{error}</Text>
        </View>
      </AppGradient>
    );
  }

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        className="absolute top-12 left-4 bg-white p-2 rounded-full shadow"
      >
        <Ionicons name="arrow-back" size={24} color="#4A90E2" />
      </TouchableOpacity>

      <View className="w-full justify-center items-center min-h-[85vh] px-4">
        <Text className="text-center text-white font-bold text-4xl">
          My <Text className="text-secondary-200">Donations</Text>
        </Text>

        <ScrollView className="mt-8 w-full">
          {subscriptions.length > 0 ? (
            subscriptions.map((donation) => (
              <View key={donation.id} className="bg-white rounded-lg p-6 mb-4 shadow-lg w-full">
                 <Text className="text-xl font-bold text-gray-900 mb-2">{donation.plan.nickname || 'Donation Plan'}</Text>
                <Text className="text-gray-700">Plan Amount: ${(donation.plan.amount / 100).toFixed(2)} {donation.plan.currency.toUpperCase()}</Text>
                <Text className="text-gray-700">Status: {donation.status}</Text>
              </View>
            ))
          ) : (
            <Text className="text-lg text-gray-600">No subscriptions found.</Text>
          )}
        </ScrollView>
      </View>
    </AppGradient>
  );
};

export default MyDonations;
