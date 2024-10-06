import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { router } from "expo-router";
import axios from 'axios';

const FoodList = () => {
  const [foods, setFoods] = useState([]);

  // Fetch food data from the API
  useEffect(() => {
    axios.get('http://your-api-url/api/foods')
      .then(response => {
        setFoods(response.data);
      })
      .catch(error => {
        console.error("Error fetching foods", error);
      });
  }, []);

  const renderFoodItem = ({ item }) => (
    <View style={{ padding: 10, margin: 5, backgroundColor: 'lightgray', borderRadius: 5 }}>
      <Text>{item.name}</Text>
      <Button title="View Details" onPress={() => router.push(`/foods/${item._id}`)} />
    </View>
  );

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10 }}>All Foods</Text>

      {/* Button to add new food */}
      <Button 
        title="Add New Food" 
        onPress={() => router.push('/foods/add')}
      />

      {/* List of foods */}
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

export default FoodList;
