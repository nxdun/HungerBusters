import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Image, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/recipes`);
        setRecipes(response.data);
        setFilteredRecipes(response.data);
      } catch (error) {
        setError('Error fetching recipes. Please try again later.');
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [apiUrl]);

  useEffect(() => {
    let updatedRecipes = [...recipes];

    if (searchTerm) {
      updatedRecipes = updatedRecipes.filter(recipe =>
        recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter) {
      updatedRecipes = updatedRecipes.filter(recipe => recipe.difficulty === difficultyFilter);
    }

    if (sortOption === 'a-z') {
      updatedRecipes.sort((a, b) => (a.description || "").localeCompare(b.description || ""));
    } else if (sortOption === 'z-a') {
      updatedRecipes.sort((a, b) => (b.description || "").localeCompare(a.description || ""));
    } else if (sortOption === 'prepTime') {
      updatedRecipes.sort((a, b) => {
        const prepTimeA = Number(a.prepTime) || 0;
        const prepTimeB = Number(b.prepTime) || 0;
        return prepTimeA - prepTimeB;
      });
    } else if (sortOption === 'cookTime') {
      updatedRecipes.sort((a, b) => {
        const cookTimeA = Number(a.cookTime) || 0;
        const cookTimeB = Number(b.cookTime) || 0;
        return cookTimeA - cookTimeB;
      });
    }

    setFilteredRecipes(updatedRecipes);
  }, [searchTerm, sortOption, difficultyFilter, recipes]);

  const renderRecipeItem = ({ item }) => {
    const imageUrl = item.image ? `${apiUrl}/${item.image}` : null;

    return (
      <View className="bg-white rounded-lg p-5 mb-4 shadow-lg w-full">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
            onError={() => console.error('Failed to load image')}
          />
        ) : (
          <Text className="text-center italic">Image not available</Text>
        )}
        <Text className="text-xl font-bold mt-2">{item.name}</Text>
        {item.description && (
          <Text className="text-base mt-2 mb-2">{item.description}</Text>
        )}

        <View className="flex-row justify-between mt-2 mb-2">
          <View className="flex-row items-center mr-5">
            <Icon name="clock-o" size={20} color="#4A90E2" />
            <Text className="ml-2 text-gray-700">{item.prepTime} mins</Text>
          </View>
          <View className="flex-row items-center mr-5">
            <Icon name="hourglass-start" size={20} color="#4A90E2" />
            <Text className="ml-2 text-gray-700">{item.cookTime} mins</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-2">
          <View className="flex-row items-center mr-5">
            <Icon name="flag" size={20} color="#4A90E2" />
            <Text className="ml-2 text-gray-700">{item.difficulty}</Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="users" size={20} color="#4A90E2" />
            <Text className="ml-2 text-gray-700">{item.servings} servings</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-yellow-500 py-2 px-4 rounded-lg mt-3"
          onPress={() => {
            router.push(`/RecipeDetails/${item._id}`);
          }}
        >
          <Text className="text-white text-center">View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortOption('');
    setDifficultyFilter('');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text className="text-gray-700 text-lg mt-4">Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <View className="p-2 bg-gray-100 flex-1">
      <Text className="text-2xl font-bold text-center my-2">All Recipes</Text>

      <TextInput
        className="h-10 border border-gray-300 px-2 rounded-lg mb-4"
        placeholder="Search Recipes..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-lg mb-4" onPress={() => setShowSidebar(!showSidebar)}>
        <Text className="text-white text-center">Toggle Filters</Text>
      </TouchableOpacity>

      {showSidebar && (
        <View className="absolute top-0 right-0 w-3/4 h-full bg-white p-5 border-l border-gray-300 z-10">
          <View className="mb-4">
            <Text className="font-bold mb-2">Sort By:</Text>
            <Picker
              selectedValue={sortOption}
              onValueChange={(itemValue) => setSortOption(itemValue)}
              className="border border-gray-300 rounded-lg"
            >
              <Picker.Item label="Select Option" value="" />
              <Picker.Item label="A-Z" value="a-z" />
              <Picker.Item label="Z-A" value="z-a" />
              <Picker.Item label="Prep Time" value="prepTime" />
              <Picker.Item label="Cook Time" value="cookTime" />
            </Picker>
          </View>

          <View className="mb-4">
            <Text className="font-bold mb-2">Filter by Difficulty:</Text>
            <Picker
              selectedValue={difficultyFilter}
              onValueChange={(itemValue) => setDifficultyFilter(itemValue)}
              className="border border-gray-300 rounded-lg"
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="Easy" value="Easy" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Hard" value="Hard" />
            </Picker>
          </View>

          <TouchableOpacity className="bg-red-500 py-2 px-4 rounded-lg mt-3" onPress={resetFilters}>
            <Text className="text-white text-center">Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row items-center bg-blue-100 py-2 px-3 rounded-lg mb-4">
        <Icon name="book" size={30} color="#4A90E2" className="mr-2" />
        <Text className="text-lg text-blue-700">
          {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Available
        </Text>
      </View>

      {userRole === 'admin' && (
        <TouchableOpacity className="bg-green-500 py-2 px-4 rounded-lg mb-4" onPress={() => router.push('/AddRecipe')}>
          <Text className="text-white text-center">Add Recipe</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item._id.toString()}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No recipes available.</Text>}
      />
    </View>
  );
};

export default RecipeList;
