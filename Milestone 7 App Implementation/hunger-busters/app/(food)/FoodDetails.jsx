import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';
import { router, useSearchParams } from "expo-router";

const FoodDetails = () => {
  const [food, setFood] = useState(null);
  const { id } = useSearchParams(); // Get the ID from the route params

  useEffect(() => {
    axios.get(`http://your-api-url/api/foods/${id}`)
      .then(response => {
        setFood(response.data);
      })
      .catch(error => {
        console.error('Error fetching food details', error);
      });
  }, [id]);

  const handleDelete = () => {
    axios.delete(`http://your-api-url/api/foods/delete/${id}`)
      .then(response => {
        console.log('Food deleted');
        router.push('/foods');
      })
      .catch(error => {
        console.error('Error deleting food', error);
      });
  };

  if (!food) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Food Details</Text>
      <Text>Name: {food.name}</Text>
      <Text>Calories: {food.calories}</Text>
      <Text>Fat: {food.fat}</Text>
      <Text>Protein: {food.protein}</Text>

      <Button title="Update Food" onPress={() => router.push(`/foods/update/${id}`)} />
      <Button title="Delete Food" onPress={handleDelete} />
    </View>
  );
};

export default FoodDetails;
