import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";

const AddFood = () => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [fat, setFat] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [sodium, setSodium] = useState('');
  const [potassium, setPotassium] = useState('');
  const [totalCarbs, setTotalCarbs] = useState('');
  const [dietaryFiber, setDietaryFiber] = useState('');
  const [sugar, setSugar] = useState('');
  const [protein, setProtein] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/foods/add`, {
        name,
        calories: Number(calories),
        fat: Number(fat),
        saturatedFat: Number(saturatedFat),
        cholesterol: Number(cholesterol),
        sodium: Number(sodium),
        potassium: Number(potassium),
        totalCarbs: Number(totalCarbs),
        dietaryFiber: Number(dietaryFiber),
        sugar: Number(sugar),
        protein: Number(protein),
      });
      Alert.alert('Success', response.data.message);
      router.push('/foods'); // Navigate back to the food list
    } catch (error) {
      console.error("Error adding food", error);
      Alert.alert('Error', 'Failed to add food');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Add New Food</Text>
      <TextInput placeholder="Food Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" />
      <TextInput placeholder="Fat" value={fat} onChangeText={setFat} keyboardType="numeric" />
      <TextInput placeholder="Saturated Fat" value={saturatedFat} onChangeText={setSaturatedFat} keyboardType="numeric" />
      <TextInput placeholder="Cholesterol" value={cholesterol} onChangeText={setCholesterol} keyboardType="numeric" />
      <TextInput placeholder="Sodium" value={sodium} onChangeText={setSodium} keyboardType="numeric" />
      <TextInput placeholder="Potassium" value={potassium} onChangeText={setPotassium} keyboardType="numeric" />
      <TextInput placeholder="Total Carbs" value={totalCarbs} onChangeText={setTotalCarbs} keyboardType="numeric" />
      <TextInput placeholder="Dietary Fiber" value={dietaryFiber} onChangeText={setDietaryFiber} keyboardType="numeric" />
      <TextInput placeholder="Sugar" value={sugar} onChangeText={setSugar} keyboardType="numeric" />
      <TextInput placeholder="Protein" value={protein} onChangeText={setProtein} keyboardType="numeric" />
      <Button title="Add Food" onPress={handleSubmit} />
    </View>
  );
};

export default AddFood;
