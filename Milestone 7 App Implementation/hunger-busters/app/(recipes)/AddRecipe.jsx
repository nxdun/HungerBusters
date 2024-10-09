import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

const AddRecipe = () => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleAddRecipe = async () => {
    if (!name || !ingredients || !instructions) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/recipes/add`, {
        name,
        ingredients,
        instructions,
      });
      Alert.alert('Success', 'Recipe added successfully');
      router.push('/RecipeList');
    } catch (error) {
      console.error("Error adding recipe", error);
      Alert.alert('Error', 'Failed to add recipe');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recipe Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter recipe name"
      />

      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Enter ingredients"
        multiline
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={styles.input}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="Enter instructions"
        multiline
      />

      <Button title="Add Recipe" onPress={handleAddRecipe} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Add similar styles here as used in other components
});

export default AddRecipe;
