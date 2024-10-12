import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Image, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import TransparentTopBar from "../../components/TransparentTopBar";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [userRole, setUserRole] = useState(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/foods`);
        setFoods(response.data);
        setFilteredFoods(response.data);
      } catch (error) {
        setError('Error fetching foods. Please try again later.');
        console.error("Error fetching foods", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [apiUrl]);

  useEffect(() => {
    filterAndSortFoods();
  }, [searchTerm, sortOrder]);

  const filterAndSortFoods = () => {
    let updatedFoods = [...foods];

    if (searchTerm) {
      updatedFoods = updatedFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    updatedFoods.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredFoods(updatedFoods);
  };

  const deleteFood = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/foods/delete/${id}`);
      setFoods(foods.filter(food => food._id !== id));
      setFilteredFoods(filteredFoods.filter(food => food._id !== id));
      Alert.alert('Success', 'Food deleted successfully');
    } catch (error) {
      console.error("Error deleting food", error);
      Alert.alert('Error', 'Failed to delete food');
    }
  };
  const handleBackPress = () => {
    router.push("/home");
  };

  const renderFoodItem = ({ item }) => {
    const imageUrl = item.image ? `${apiUrl}/${item.image}` : null;

    return (
      <View className="bg-white rounded-lg p-5 mb-4 shadow-lg w-full">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
            onError={() => console.error('Failed to load image')}
          />
        ) : (
          <Text className="text-center italic">Image not available</Text>
        )}
        <Text className="text-xl font-bold mt-2">{item.name}</Text>
        <Text className="text-base mt-2 mb-2">{item.description}</Text>

        <TouchableOpacity className="bg-yellow-500 py-2 px-4 rounded-lg mt-3"
          onPress={() => {
            router.push(`/FoodDetails/${item._id}`);
          }}
        >
          <Text className="text-white text-center">View Details</Text>
        </TouchableOpacity>
        {userRole === 'admin' && (
          <TouchableOpacity className="bg-red-500 py-2 px-4 rounded-lg mt-3"
            onPress={() => deleteFood(item._id)}
          >
            <Text className="text-white text-center">Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-gray-700 text-lg mt-4">Loading foods...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <View className="p-2 bg-gray-100 flex-1">
      <TransparentTopBar
        title="Home"
        onBackPress={handleBackPress}
      />
      <Text className="text-2xl font-bold text-center my-2">All Foods</Text>


      <TextInput
        className="h-10 border border-gray-300 px-2 rounded-lg mb-4"
        placeholder="Search Foods..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <View className="flex-row items-center bg-blue-100 py-2 px-3 rounded-lg mb-4">
        <Icon name="cutlery" size={30} color="#4A90E2" className="mr-2" />
        <Text className="text-lg text-blue-700">
          {filteredFoods.length} {filteredFoods.length === 1 ? 'Food' : 'Foods'} Available
        </Text>
      </View>

      {userRole === 'admin' && (
        <TouchableOpacity className="bg-green-500 py-2 px-4 rounded-lg mb-4" onPress={() => router.push('/AddFood')}>
          <Text className="text-white text-center">Add Food</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredFoods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item._id.toString()}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No foods available.</Text>}
      />
    </View>
  );
};

export default FoodList;
