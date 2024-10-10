import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const AddFood = () => {
  const [form, setForm] = useState({
    name: '',
    calories: '',
    fat: '',
    saturatedFat: '',
    cholesterol: '',
    sodium: '',
    potassium: '',
    totalCarbs: '',
    dietaryFiber: '',
    sugar: '',
    protein: '',
    vitamins: {
      vitaminC: '',
      vitaminD: '',
      vitaminB6: '',
      cobalamin: '',
    },
    minerals: {
      calcium: '',
      iron: '',
      magnesium: '',
    },
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleChangeText = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNestedChangeText = (parent, field, value) => {
    setForm({ ...form, [parent]: { ...form[parent], [field]: value } });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }
    
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const submit = async () => {
    setIsSubmitting(true);
    setError('');

    // Validate form fields
    const requiredFields = Object.keys(form).filter(field => {
      if (typeof form[field] === 'object') {
        return Object.keys(form[field]).some(subField => !form[field][subField]);
      }
      return !form[field];
    });

    if (requiredFields.length > 0) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (!selectedImage) {
      setError('Please upload an image of the food item.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (typeof form[key] === 'object') {
          Object.keys(form[key]).forEach(subKey => {
            formData.append(`${key}.${subKey}`, form[key][subKey]);
          });
        } else {
          formData.append(key, form[key]);
        }
      });

      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'food.jpg',
      });

      const response = await axios.post(`${apiUrl}/api/foods/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', response.data.message);
      // Reset form after successful submission
      setForm({
        name: '',
        calories: '',
        fat: '',
        saturatedFat: '',
        cholesterol: '',
        sodium: '',
        potassium: '',
        totalCarbs: '',
        dietaryFiber: '',
        sugar: '',
        protein: '',
        vitamins: {
          vitaminC: '',
          vitaminD: '',
          vitaminB6: '',
          cobalamin: '',
        },
        minerals: {
          calcium: '',
          iron: '',
          magnesium: '',
        },
      });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error adding food:', error);
      setError(error.response?.data?.message || 'Failed to add food');
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
            title="Food Name"
            value={form.name}
            handleChangeText={(value) => handleChangeText('name', value)}
            otherStyles="mt-10"
          />
          <FormField
            title="Calories"
            value={form.calories}
            handleChangeText={(value) => handleChangeText('calories', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Fat"
            value={form.fat}
            handleChangeText={(value) => handleChangeText('fat', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Saturated Fat"
            value={form.saturatedFat}
            handleChangeText={(value) => handleChangeText('saturatedFat', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Cholesterol"
            value={form.cholesterol}
            handleChangeText={(value) => handleChangeText('cholesterol', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Sodium"
            value={form.sodium}
            handleChangeText={(value) => handleChangeText('sodium', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Potassium"
            value={form.potassium}
            handleChangeText={(value) => handleChangeText('potassium', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Total Carbs"
            value={form.totalCarbs}
            handleChangeText={(value) => handleChangeText('totalCarbs', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Dietary Fiber"
            value={form.dietaryFiber}
            handleChangeText={(value) => handleChangeText('dietaryFiber', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Sugar"
            value={form.sugar}
            handleChangeText={(value) => handleChangeText('sugar', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Protein"
            value={form.protein}
            handleChangeText={(value) => handleChangeText('protein', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />

<FormField
            title="Vitamin C"
            value={form.vitamins.vitaminC}
            handleChangeText={(value) => handleNestedChangeText('vitamins', 'vitaminC', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Vitamin D"
            value={form.vitamins.vitaminD}
            handleChangeText={(value) => handleNestedChangeText('vitamins', 'vitaminD', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Vitamin B6"
            value={form.vitamins.vitaminB6}
            handleChangeText={(value) => handleNestedChangeText('vitamins', 'vitaminB6', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Cobalamin"
            value={form.vitamins.cobalamin}
            handleChangeText={(value) => handleNestedChangeText('vitamins', 'cobalamin', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />

          {/* Minerals Section */}
          <Text className="text-xl text-white mt-7">Minerals</Text>
          <FormField
            title="Calcium"
            value={form.minerals.calcium}
            handleChangeText={(value) => handleNestedChangeText('minerals', 'calcium', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Iron"
            value={form.minerals.iron}
            handleChangeText={(value) => handleNestedChangeText('minerals', 'iron', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />
          <FormField
            title="Magnesium"
            value={form.minerals.magnesium}
            handleChangeText={(value) => handleNestedChangeText('minerals', 'magnesium', value)}
            otherStyles="mt-7"
            keyboardType="numeric"
          />

          <TouchableOpacity onPress={pickImage} className="mt-7 bg-secondary p-4 rounded-lg">
            <Text className="text-white text-center">Upload Food Image</Text>
          </TouchableOpacity>

          {selectedImage && (
            <View className="mt-4">
              <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
              <TouchableOpacity onPress={removeImage} className="bg-red-500 p-2 mt-2 rounded-lg">
                <Text className="text-white text-center">Remove Image</Text>
              </TouchableOpacity>
            </View>
          )}

          {error ? <Text className="text-red-500 mt-4">{error}</Text> : null}

          <CustomButton
            title="Add Food"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddFood;
