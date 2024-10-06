import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // For icons

const Donate = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchApprovedDonations = async () => {
    try {
      const [schoolResponse, elderResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/v1/school-donations`),
        axios.get(`${apiUrl}/api/v1/elder-donations`),
      ]);

      const combinedRequests = [
        ...schoolResponse.data.map(request => ({ ...request, type: 'school' })),
        ...elderResponse.data.map(request => ({ ...request, type: 'elder' })),
      ];

      // Filter to include only approved donations
      const approvedOnly = combinedRequests.filter(request => request.approved);
      setApprovedRequests(approvedOnly);
      setLoading(false);
    } catch (err) {
      setError('Failed to load approved donations.');
      setLoading(false);
      console.error('Error fetching approved donations:', err);
    }
  };

  useEffect(() => {
    fetchApprovedDonations();
  }, []);

  const handleDonate = (request) => {
    Alert.alert("Donate", `You are donating to ${request.type === 'school' ? request.schoolName : request.elderHomeName}`);
  };

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-lg p-5 mb-4 shadow-lg w-full">
      <Text className="text-xl font-semibold text-gray-800 mb-1">
        {item.type === 'school' ? item.schoolName : item.elderHomeName}
      </Text>
      <View className="flex flex-row items-center">
        <Ionicons name="person-outline" size={18} color="#4A90E2" />
        <Text className="text-gray-600 ml-2">
          {item.type === 'school' ? item.principalName : item.contactPerson}
        </Text>
      </View>
      <View className="flex flex-row items-center">
        <Ionicons name="location-outline" size={18} color="#4A90E2" />
        <Text className="text-gray-600 ml-2">
          {item.type === 'school' ? item.address : item.elderHomeAddress}
        </Text>
      </View>
      <View className="flex flex-row items-center">
        <Ionicons name="call-outline" size={18} color="#4A90E2" />
        <Text className="text-gray-600 ml-2">{item.contactNumber}</Text>
      </View>

      {/* Donate Button */}
      <TouchableOpacity
        className="bg-green-500 py-2 px-4 rounded-lg mt-4"
        onPress={() => handleDonate(item)}
      >
        <Text className="text-white text-center font-semibold">Donate</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-lg mt-2">Loading donations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-red-500">{error}</Text>
      </View>
    );
  }

  if (approvedRequests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-600">No donations available at this moment.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-7 bg-gray-100">
      <Text className="text-3xl font-extrabold mb-6 text-center text-gray-800">Donations</Text>

      <FlatList
        data={approvedRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default Donate;
