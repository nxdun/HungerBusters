import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import FormField from '../../components/FormField'; // Ensure this is created similarly to AddFood
import CustomButton from '../../components/CustomButton';

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: '',
    prepTime: '',
    cookTime: '',
    difficulty: '',
    servings: '',
    description: '',
    ingredients: '',
    method: '',
    videoLink: '',
  });
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
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleChangeText = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNutritionChange = (key, value) => {
    setNutrition({ ...nutrition, [key]: value });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleAddRecipe = async () => {
    setIsSubmitting(true);
    setError('');

    // Validate form fields
    const requiredFields = Object.keys(form).filter(field => !form[field]);
    if (requiredFields.length > 0) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      Object.keys(nutrition).forEach(key => {
        formData.append(`nutrition[${key}]`, nutrition[key]);
      });
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'recipe.jpg',
      });

      await axios.post(`${apiUrl}/api/recipes/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Recipe added successfully');
      router.push('/RecipeList');
    } catch (error) {
      console.error('Error adding recipe:', error);
      setError(error.response?.data?.message || 'Failed to add recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Add New Food</Text>

        <FormField
          title="Recipe Title"
          value={form.title}
          handleChangeText={(value) => handleChangeText('title', value)}
        />
        <FormField
          title="Preparation Time"
          value={form.prepTime}
          handleChangeText={(value) => handleChangeText('prepTime', value)}
        />
        <FormField
          title="Cooking Time"
          value={form.cookTime}
          handleChangeText={(value) => handleChangeText('cookTime', value)}
        />
        <FormField
          title="Difficulty"
          value={form.difficulty}
          handleChangeText={(value) => handleChangeText('difficulty', value)}
        />
        <FormField
          title="Servings"
          value={form.servings}
          handleChangeText={(value) => handleChangeText('servings', value)}
          keyboardType="numeric"
        />
        <FormField
          title="Description"
          value={form.description}
          handleChangeText={(value) => handleChangeText('description', value)}
          multiline
        />
        <Text style={{ marginVertical: 8 }}>Nutrition</Text>
        {Object.keys(nutrition).map((key) => (
          <FormField
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            value={nutrition[key]}
            handleChangeText={(value) => handleNutritionChange(key, value)}
          />
        ))}
        <FormField
          title="Ingredients (newline-separated)"
          value={form.ingredients}
          handleChangeText={(value) => handleChangeText('ingredients', value)}
          multiline
        />
        <FormField
          title="Method (newline-separated)"
          value={form.method}
          handleChangeText={(value) => handleChangeText('method', value)}
          multiline
        />
        <FormField
          title="Video Link"
          value={form.videoLink}
          handleChangeText={(value) => handleChangeText('videoLink', value)}
        />

        <TouchableOpacity onPress={pickImage} className="mt-7 bg-secondary p-4 rounded-lg">
            <Text className="text-white text-center">Upload Recipe Image</Text>
        </TouchableOpacity>

        {image && (
          <View style={{ marginTop: 16 }}>
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            <TouchableOpacity onPress={removeImage} style={{ marginTop: 8, backgroundColor: '#FF5722', padding: 8, borderRadius: 8 }}>
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {error ? <Text className="text-red-500 mt-4">{error}</Text> : null}

        <CustomButton
          title="Add Recipe"
          handlePress={handleAddRecipe}
          isLoading={isSubmitting}
          containerStyles="mt-7"
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default AddRecipe;
