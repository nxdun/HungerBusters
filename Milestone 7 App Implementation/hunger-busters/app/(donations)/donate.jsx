import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';

const Donate = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchApprovedDonations = async () => {
    try {
      const [schoolResponse, elderResponse] = await Promise.all([
        axios.get(`${apiUrl}/api/v1/school-donations`),
        axios.get(`${apiUrl}/api/v1/elder-donations`),
      ]);

      const combinedRequests = [
        ...schoolResponse.data.map(request => ({
          ...request,
          type: 'school',
          monthlyPriceId: 'price_1Q7xDqG4mkmOcCt5dX6Bd5RN',
          annualPriceId: 'price_1Q7xFSG4mkmOcCt580QetHxB'
        })),
        ...elderResponse.data.map(request => ({
          ...request,
          type: 'elder',
          monthlyPriceId: 'price_1Q7xDqG4mkmOcCt5dX6Bd5RN',
          annualPriceId: 'price_1Q7xFSG4mkmOcCt580QetHxB'
        })),
      ];

      const approvedOnly = combinedRequests.filter(request => request.approved);
      setApprovedRequests(approvedOnly);
      setLoading(false);
    } catch (err) {
      setError('Failed to load approved donations.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedDonations();
  }, []);

  const handleSubscribe = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleDonate = async (subscriptionType) => {
    if (!selectedRequest) return;

    try {
      const priceId = subscriptionType === 'monthly' ? selectedRequest.monthlyPriceId : selectedRequest.annualPriceId;

      const response = await axios.post(`${apiUrl}/create-subscription`, {
        email: "customer@example.com",  // Replace with actual email from the user
        priceId,
      });

      const { clientSecret } = response.data;

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        merchantDisplayName: 'HungerBuster',
      });

      if (initError) {
        console.error("Init PaymentSheet error:", initError);
        return Alert.alert("Error", "Failed to initialize payment sheet");
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Payment failed", paymentError.message);
      } else {
        Alert.alert("Payment successful", "Thank you for your donation!");
      }
    } catch (err) {
      console.error("Error in donation:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-lg p-6 mb-5 shadow-lg w-full">
      <Text className="text-xl font-bold text-gray-900 mb-2">
        {item.type === 'school' ? item.schoolName : item.elderHomeName}
      </Text>
      <View className="flex flex-row items-center mb-1">
      <Ionicons name="person-outline" size={18} color="#4A90E2" />
        <Text className="text-gray-700 ml-2">
          {item.type === 'school' ? item.principalName : item.contactPerson}
        </Text>
      </View>
      <View className="flex flex-row items-center mb-1">
        <Ionicons name="location-outline" size={18} color="#4A90E2" />
        <Text className="text-gray-600 ml-2">
          {item.type === 'school' ? item.address : item.elderHomeAddress}
        </Text>
      </View>
      <View className="flex flex-row items-center mb-1">
        <Ionicons name="call-outline" size={18} color="#4A90E2" />
        <Text className="text-gray-600 ml-2">{item.contactNumber}</Text>
      </View>
      <TouchableOpacity
        className="bg-indigo-600 py-3 px-5 rounded-lg shadow-md"
        onPress={() => handleSubscribe(item)}
      >
        <Text className="text-white text-center font-semibold">Subscribe</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-lg mt-2 text-gray-700">Loading donations...</Text>
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
    <View className="flex-1 p-5 bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-center text-gray-900">Available Donations</Text>

      <FlatList
        data={approvedRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal for selecting subscription type */}
      {selectedRequest && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-8 rounded-lg w-11/12 shadow-xl">
              <Text className="text-xl font-semibold text-gray-900 mb-5">Choose Subscription</Text>

              <TouchableOpacity
                className="bg-green-500 py-4 px-6 rounded-lg mb-4 shadow-lg"
                onPress={() => handleDonate('monthly')}
              >
                <Text className="text-white text-center font-semibold">Donate Monthly Plan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-500 py-4 px-6 rounded-lg shadow-lg"
                onPress={() => handleDonate('annual')}
              >
                <Text className="text-white text-center font-semibold">Donate Annually Plan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-6 py-3"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-center text-red-500">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Donate;