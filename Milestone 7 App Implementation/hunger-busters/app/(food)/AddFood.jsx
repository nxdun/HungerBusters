import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

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
  const [image, setImage] = useState(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('calories', Number(calories));
      formData.append('fat', Number(fat));
      formData.append('saturatedFat', Number(saturatedFat));
      formData.append('cholesterol', Number(cholesterol));
      formData.append('sodium', Number(sodium));
      formData.append('potassium', Number(potassium));
      formData.append('totalCarbs', Number(totalCarbs));
      formData.append('dietaryFiber', Number(dietaryFiber));
      formData.append('sugar', Number(sugar));
      formData.append('protein', Number(protein));
      
      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg', // Adjust this based on your image type
          name: 'food.jpg', // You can change the name here
        });
      }

      const response = await axios.post(`${apiUrl}/api/foods/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', response.data.message);
      router.push('/foods'); // Navigate back to the food list
    } catch (error) {
      console.error("Error adding food", error);
      Alert.alert('Error', 'Failed to add food');
    }
  };

  const pickImage = async () => {
    // Request permission to access the camera and media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri); // Store the image URI
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

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Add Food" onPress={handleSubmit} />
    </View>
  );
};

export default AddFood;
