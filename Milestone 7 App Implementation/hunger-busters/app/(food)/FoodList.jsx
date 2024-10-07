import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/foods`);
        setFoods(response.data);
      } catch (error) {
        setError('Error fetching foods. Please try again later.');
        console.error("Error fetching foods", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [apiUrl]);

  const deleteFood = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/foods/delete/${id}`);
      setFoods(foods.filter(food => food._id !== id));
      Alert.alert('Success', 'Food deleted successfully');
    } catch (error) {
      console.error("Error deleting food", error);
      Alert.alert('Error', 'Failed to delete food');
    }
  };

  const renderFoodItem = ({ item }) => (
    <View style={{ padding: 10, margin: 5, backgroundColor: 'lightgray', borderRadius: 5 }}>
      <Text>{item.name}</Text>
      <Text>{item.name}</Text>
      <Button
        title="View Details"
        onPress={() => {
          // Navigate to FoodDetails with foodId as a parameter
          router.push(`/FoodDetails/${item._id}`); // Updated to use path parameter
        }}
      />
      <Button
        title="Delete"
        color="red"
        onPress={() => deleteFood(item._id)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading foods...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10 }}>All Foods</Text>
      <Button title="Add New Food" onPress={() => router.push('/AddFood')} />
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>No foods available.</Text>}
      />
    </View>
  );
};

export default FoodList;
