import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView  } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const AddRecipe = () => {
  // State variables for each form input
  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [servings, setServings] = useState('');
  const [description, setDescription] = useState('');
  const [nutrition, setNutrition] = useState({
    kcal: '',
    fat: '',
    saturates: '',
    carbs: '',
    sugars: '',
    fibre: '',
    protein: '',
    salt: '',
  });
  const [ingredients, setIngredients] = useState('');
  const [method, setMethod] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [image, setImage] = useState(null); // State for storing the image URI

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleAddRecipe = async () => {
    // Check if all required fields are filled
    if (!title || !prepTime || !cookTime || !difficulty || !servings || !description || !ingredients || !method) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('prepTime', prepTime);
      formData.append('cookTime', cookTime);
      formData.append('difficulty', difficulty);
      formData.append('servings', servings);
      formData.append('description', description);
      
      // Append nutrition data
      Object.keys(nutrition).forEach(key => {
        formData.append(`nutrition[${key}]`, nutrition[key]);
      });

      formData.append('ingredients', ingredients.split('\n')); // Split ingredients by line breaks
      formData.append('method', method.split('\n')); // Split method by line breaks
      
      // Append video link if provided
      if (videoLink) {
        formData.append('videoLink', videoLink);
      }

      // Add image to formData if it exists
      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg', // Adjust this based on your image type
          name: 'recipe.jpg', // You can change the name here
        });
      }

      // Send POST request to the backend
      await axios.post(`${apiUrl}/api/recipes/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Recipe added successfully');
      router.push('/RecipeList');
    } catch (error) {
      console.error("Error adding recipe", error);
      Alert.alert('Error', 'Failed to add recipe');
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
    <ScrollView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.label}>Recipe Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter recipe title"
      />

      <Text style={styles.label}>Preparation Time</Text>
      <TextInput
        style={styles.input}
        value={prepTime}
        onChangeText={setPrepTime}
        placeholder="e.g., 10 mins"
      />

      <Text style={styles.label}>Cooking Time</Text>
      <TextInput
        style={styles.input}
        value={cookTime}
        onChangeText={setCookTime}
        placeholder="e.g., 30 mins"
      />

      <Text style={styles.label}>Difficulty</Text>
      <TextInput
        style={styles.input}
        value={difficulty}
        onChangeText={setDifficulty}
        placeholder="e.g., Easy"
      />

      <Text style={styles.label}>Servings</Text>
      <TextInput
        style={styles.input}
        value={servings}
        onChangeText={setServings}
        placeholder="e.g., 4"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter recipe description"
        multiline
      />

      <Text style={styles.label}>Nutrition (kcal, fat, saturates, carbs, sugars, fibre, protein, salt)</Text>
      {Object.keys(nutrition).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          value={nutrition[key]}
          onChangeText={(value) => setNutrition({ ...nutrition, [key]: value })}
          placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}`}
        />
      ))}

      <Text style={styles.label}>Ingredients (separate each ingredient with a newline)</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Enter ingredients"
        multiline
      />

      <Text style={styles.label}>Method (separate each step with a newline)</Text>
      <TextInput
        style={styles.input}
        value={method}
        onChangeText={setMethod}
        placeholder="Enter cooking instructions"
        multiline
      />

      <Text style={styles.label}>Video Link (optional)</Text>
      <TextInput
        style={styles.input}
        value={videoLink}
        onChangeText={setVideoLink}
        placeholder="Enter YouTube video link"
      />

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Add Recipe" onPress={handleAddRecipe} />
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default AddRecipe;
