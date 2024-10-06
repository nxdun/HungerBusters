import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // Fetch donation requests from both APIs
  const fetchDonationRequests = async () => {
    try {
      const [schoolResponse, elderResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/v1/school-donations`),
        axios.get(`${apiUrl}/api/v1/elder-donations`),
      ]);
      
      // Combine both responses into one array
      const combinedRequests = [
        ...schoolResponse.data.map(request => ({ ...request, type: 'school' })),
        ...elderResponse.data.map(request => ({ ...request, type: 'elder' })),
      ];

      setRequests(combinedRequests); // Set the fetched requests
      setLoading(false);
    } catch (err) {
      setError('Failed to load donation requests.');
      setLoading(false);
      console.error('Error fetching donation requests:', err);
    }
  };

  useEffect(() => {
    fetchDonationRequests(); // Call fetch on component mount
  }, []);

  // Function to approve a donation request
  const approveRequest = async (id, type) => {
    try {
      await axios.put(`${apiUrl}/api/v1/${type}-donations/${id}/approve`);
      setRequests((prevRequests) => 
        prevRequests.map(request => 
          request._id === id ? { ...request, approved: true } : request
        )
      );
      Alert.alert("Success", "You have approved the donation request.");
    } catch (err) {
      Alert.alert("Error", "Failed to approve the donation request.");
      console.error('Error approving request:', err);
    }
  };

  // Count the number of approved requests
  const approvedCount = requests.filter(request => request.approved).length;

  // Render each donation request item
  const renderItem = ({ item }) => (
    <View className={`bg-white rounded-lg p-5 mb-4 shadow-lg w-full transition-transform transform ${item.approved ? 'bg-green-50' : ''}`}>
      <Text className="text-lg font-semibold">
        {item.type === 'school' ? item.schoolName : item.elderHomeName}
      </Text>
      {item.approved ? ( // Show approved message if the request is approved
        <Text className="text-green-500 font-semibold mt-2">Approved</Text>
      ) : (
        <TouchableOpacity
          className="bg-green-500 py-3 px-5 rounded-lg mt-3 transition-transform active:scale-95"
          onPress={() => approveRequest(item._id, item.type)}
        >
          <Text className="text-white text-center font-semibold">Approve Request</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg">Loading donation requests...</Text>
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

  return (
    <View className="flex-1 p-7 bg-gray-100">
      <Text className="text-3xl font-extrabold mb-6 text-center text-gray-800">Donation Requests</Text>
      
      {/* Approved Count Display */}
      <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <Text className="text-lg font-semibold">Approved Requests: {approvedCount}</Text>
        <Text className="text-sm text-gray-600">Total Approvals: {requests.length}</Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id} // Use _id for unique key
        contentContainerStyle={{ paddingBottom: 20 }} // Add bottom padding for better UX
      />
    </View>
  );
};

export default DonationRequests;
