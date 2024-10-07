import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";

const UpdateFood = ({ foodId }) => {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/foods/${foodId}`);
        setFood(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch food for updating');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId, apiUrl]);

  const handleUpdate = async () => {
    try {
      await axios.put(`${apiUrl}/api/foods/update/${foodId}`, food);
      Alert.alert('Success', 'Food updated successfully');
      router.push('/foods'); // Navigate back to the food list
    } catch (error) {
      Alert.alert('Error', 'Failed to update food');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Update Food</Text>
      <TextInput placeholder="Food Name" value={food.name} onChangeText={(text) => setFood({ ...food, name: text })} />
      <TextInput placeholder="Calories" value={String(food.calories)} onChangeText={(text) => setFood({ ...food, calories: Number(text) })} keyboardType="numeric" />
      {/* Repeat for other fields */}
      <Button title="Update Food" onPress={handleUpdate} />
    </View>
  );
};

export default UpdateFood;
