import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useParams } from 'react-router-dom'; // Import useParams

const FoodDetails = () => {
  const router = useRouter();
  const { foodId } = useParams(); // Use useParams to get foodId from the route params
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [food, setFood] = useState(null); // Initialize food state
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        if (!foodId) throw new Error('Food ID is missing');
        
        // Fetch food details using foodId
        const response = await axios.get(`${apiUrl}/api/foods/${foodId}`); 
        
        // Log the fetched data to check the structure
        console.log("Fetched food details:", response.data);
        
        setFood(response.data); // Set fetched food details to state
      } catch (error) {
        setError(error.message || 'Error fetching food details. Please try again later.');
        console.error("Error fetching food details", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
  
    fetchFoodDetails();
  }, [foodId, apiUrl]); // Add foodId as a dependency

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/api/foods/delete/${foodId}`);
      Alert.alert('Success', 'Food deleted successfully');
      router.push('/FoodList');
    } catch (error) {
      console.error("Error deleting food", error);
      Alert.alert('Error', 'Failed to delete food');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading food details...</Text>
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

  if (!food) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No food details available.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      {/* Display only the food name */}
      <Text style={{ fontSize: 24 }}>{food.name}</Text>

      {/* Display all food details */}
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Calories: {food.calories}</Text>
      <Text>Fat: {food.fat} g</Text>
      <Text>Saturated Fat: {food.saturatedFat} g</Text>
      <Text>Cholesterol: {food.cholesterol} mg</Text>
      <Text>Sodium: {food.sodium} mg</Text>
      <Text>Potassium: {food.potassium} mg</Text>
      <Text>Total Carbohydrates: {food.totalCarbs} g</Text>
      <Text>Dietary Fiber: {food.dietaryFiber} g</Text>
      <Text>Sugar: {food.sugar} g</Text>
      <Text>Protein: {food.protein} g</Text>
      <Text>Vitamins:</Text>
      <Text>  - Vitamin C: {food.vitamins?.vitaminC || 0} mg</Text>
      <Text>  - Vitamin D: {food.vitamins?.vitaminD || 0} IU</Text>
      <Text>  - Vitamin B6: {food.vitamins?.vitaminB6 || 0} mg</Text>
      <Text>  - Cobalamin: {food.vitamins?.cobalamin || 0} µg</Text>
      <Text>Minerals:</Text>
      <Text>  - Calcium: {food.minerals?.calcium || 0} mg</Text>
      <Text>  - Iron: {food.minerals?.iron || 0} mg</Text>
      <Text>  - Magnesium: {food.minerals?.magnesium || 0} mg</Text>

      <Button title="Delete Food" color="red" onPress={handleDelete} />
      <Button title="Back to List" onPress={() => router.push('/FoodList')} />
    </View>
  );
};

export default FoodDetails;
