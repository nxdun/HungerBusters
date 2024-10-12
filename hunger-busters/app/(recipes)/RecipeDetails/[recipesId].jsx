import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import TransparentTopBar from "../../../components/TransparentTopBar";

const RecipeDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const recipeId = pathname.split('/').pop(); // Get recipeId from URL path
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to hold user role
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole'); // Retrieve role from AsyncStorage
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        if (!recipeId) throw new Error('Recipe ID is missing');

        const response = await axios.get(`${apiUrl}/api/recipes/${recipeId}`);
        setRecipe(response.data);
        console.log("Fetched recipe details:", response.data); // Check what is being fetched
      } catch (error) {
        setError(error.message || 'Error fetching recipe details. Please try again later.');
        console.error("Error fetching recipe details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId, apiUrl]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/api/recipes/delete/${recipeId}`);
      Alert.alert('Success', 'Recipe deleted successfully');
      router.push('/RecipeList');
    } catch (error) {
      console.error("Error deleting recipe", error);
      Alert.alert('Error', 'Failed to delete recipe');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${apiUrl}/api/recipes/update/${recipeId}`, recipe);
      Alert.alert('Success', 'Recipe updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error("Error updating recipe", error);
      Alert.alert('Error', 'Failed to update recipe');
    }
  };

  const handleInputChange = (field, value) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [field]: value,
    }));
  };

  const openYouTubeVideo = () => {
    if (recipe.videoLink) {
      Linking.openURL(recipe.videoLink).catch(err => console.error("Failed to open URL:", err));
    } else {
      Alert.alert('Error', 'No video link available.');
    }
  };
  const handleBackPress = () => {
    router.push("/RecipeList");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading recipe details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text>No recipe details available.</Text>
      </View>
    );
  }

  const imageUrl = recipe.image ? `${apiUrl}/${recipe.image}` : null; 

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <TransparentTopBar
        title="Recipes List"
        onBackPress={handleBackPress}
      />
      <Text style={styles.title}>{recipe.title}</Text>
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.foodImage} 
          resizeMode="cover" 
          onError={() => console.error('Failed to load image')}
        />
      ) : (
        <Text style={styles.noImageText}>Image not available</Text>
      )}

      {/* New Fields */}
      {editMode ? (
        <>
          <Text style={styles.label}>Preparation Time:</Text>
          <TextInput
            style={styles.input}
            value={recipe.prepTime}
            onChangeText={(text) => handleInputChange('prepTime', text)}
          />

          <Text style={styles.label}>Cook Time:</Text>
          <TextInput
            style={styles.input}
            value={recipe.cookTime}
            onChangeText={(text) => handleInputChange('cookTime', text)}
          />

          <Text style={styles.label}>Difficulty:</Text>
          <TextInput
            style={styles.input}
            value={recipe.difficulty}
            onChangeText={(text) => handleInputChange('difficulty', text)}
          />

          <Text style={styles.label}>Servings:</Text>
          <TextInput
            style={styles.input}
            value={recipe.servings}
            onChangeText={(text) => handleInputChange('servings', text)}
          />
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            value={recipe.description}
            onChangeText={(text) => handleInputChange('description', text)}
          />

          <Text style={styles.label}>Nutrition (Kcal):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.kcal)} // Convert to string for TextInput
            onChangeText={(text) => handleInputChange('nutrition.kcal', Number(text))}
          />
          <Text style={styles.label}>Nutrition (Fat):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.fat)}
            onChangeText={(text) => handleInputChange('nutrition.fat', Number(text))}
          />
          <Text style={styles.label}>Nutrition (Saturates):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.saturates)}
            onChangeText={(text) => handleInputChange('nutrition.saturates', Number(text))}
          />
          <Text style={styles.label}>Nutrition (Carbs):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.carbs)}
            onChangeText={(text) => handleInputChange('nutrition.carbs', Number(text))}
          />
          <Text style={styles.label}>Nutrition (Sugars):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.sugars)}
            onChangeText={(text) => handleInputChange('nutrition.sugars', Number(text))}
          />
          <Text style={styles.label}>Nutrition (Fibre):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.fibre)}
            onChangeText={(text) => handleInputChange('nutrition.fibre', Number(text))}
          />
          <Text style={styles.label}>Nutrition (Protein):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.protein)}
            onChangeText={(text) => handleInputChange('nutrition.protein', Number(text))}
          />
          <Text style={styles.label}>Nutrition (Salt):</Text>
          <TextInput
            style={styles.input}
            value={String(recipe.nutrition.salt)}
            onChangeText={(text) => handleInputChange('nutrition.salt', Number(text))}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Preparation Time:</Text>
          <Text style={styles.description}>{recipe.prepTime || 'N/A'}</Text>

          <Text style={styles.label}>Cook Time:</Text>
          <Text style={styles.description}>{recipe.cookTime || 'N/A'}</Text>

          <Text style={styles.label}>Difficulty:</Text>
          <Text style={styles.description}>{recipe.difficulty || 'N/A'}</Text>

          <Text style={styles.label}>Servings:</Text>
          <Text style={styles.description}>{recipe.servings || 'N/A'}</Text>

          <Text style={styles.label}>Description:</Text>
          <Text style={styles.description}>{recipe.description || 'N/A'}</Text>

          <Text style={styles.label}>Nutrition:</Text>
          <Text style={styles.nutritionText}>Kcal: {recipe.nutrition.kcal || 'N/A'}</Text>
          <Text style={styles.nutritionText}>Fat: {recipe.nutrition.fat || 'N/A'}</Text>
          <Text style={styles.nutritionText}>Saturates: {recipe.nutrition.saturates || 'N/A'}</Text>
          <Text style={styles.nutritionText}>Carbs: {recipe.nutrition.carbs || 'N/A'}</Text>
          <Text style={styles.nutritionText}>Sugars: {recipe.nutrition.sugars || 'N/A'}</Text>
          <Text style={styles.nutritionText}>Fibre: {recipe.nutrition.fibre || 'N/A'}</Text>
          <Text style={styles.nutritionText}>Protein: {recipe.nutrition.protein || 'N/A'}</Text>
          <Text style={styles.nutritionText}>Salt: {recipe.nutrition.salt || 'N/A'}</Text>
        </>
      )}

  {/* Ingredients Section */}
  <Text style={styles.label}>Ingredients:</Text>
  {editMode ? (
    <TextInput
      style={styles.input}
      value={recipe.ingredients.join('\n')} // Join the array into a single string for editing
      onChangeText={(text) => handleInputChange('ingredients', text.split('\n'))} // Split the input back into an array
      multiline
    />
  ) : (
    recipe.ingredients && recipe.ingredients.length > 0 ? (
      <View style={styles.listContainer}>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.listItem}>• {ingredient}</Text>
        ))}
      </View>
    ) : (
      <Text style={styles.description}>No ingredients available.</Text>
    )
  )}

  {/* Method Section */}
  <Text style={styles.label}>Method:</Text>
  {editMode ? (
    <TextInput
      style={styles.input}
      value={recipe.method.join('\n')} // Join the array into a single string for editing
      onChangeText={(text) => handleInputChange('method', text.split('\n'))} // Split the input back into an array
      multiline
    />
  ) : (
    recipe.method && recipe.method.length > 0 ? (
      <View style={styles.listContainer}>
        {recipe.method.map((step, index) => (
          <Text key={index} style={styles.listItem}>Step {index + 1}: {step}</Text>
        ))}
      </View>
    ) : (
      <Text style={styles.description}>No method available.</Text>
    )
  )}

      <Text style={styles.label}>Video Link:</Text>
      {editMode ? (
        <TextInput
          style={styles.input}
          value={recipe.videoLink}
          onChangeText={(text) => handleInputChange('videoLink', text)}
        />
      ) : (
        <TouchableOpacity onPress={openYouTubeVideo}>
          <Text style={styles.videoLink}>{recipe.videoLink || 'No link available'}</Text>
        </TouchableOpacity>
      )}

      {userRole === 'admin' && (
        <View style={styles.buttonContainer}>
          {editMode ? (
            <>
              <Button title="Save Changes" onPress={handleUpdate} />
              <Button title="Cancel" onPress={() => setEditMode(false)} />
            </>
          ) : (
            <>
              <Button title="Edit" onPress={() => setEditMode(true)} />
              <Button title="Delete" onPress={handleDelete} color="red" />
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  noImageText: {
    color: 'gray',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    marginBottom: 10,
  },
  nutritionText: {
    marginLeft: 10,
  },
  videoLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  listContainer: {
    marginVertical: 10,
  },
  listItem: {
    marginBottom: 5,
    fontSize: 16,
  },  
});

export default RecipeDetails;
