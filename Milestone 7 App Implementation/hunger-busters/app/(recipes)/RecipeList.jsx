import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/recipes`);
        setRecipes(response.data);
      } catch (error) {
        setError('Error fetching recipes. Please try again later.');
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [apiUrl]);

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/recipes/delete/${id}`);
      setRecipes(recipes.filter(recipe => recipe._id !== id));
      Alert.alert('Success', 'Recipe deleted successfully');
    } catch (error) {
      console.error("Error deleting recipe", error);
      Alert.alert('Error', 'Failed to delete recipe');
    }
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeName}>{item.name}</Text>
      {item.description && (
        <Text style={styles.recipeDescription}>{item.description}</Text>
      )}
      {item.preparationTime && (
        <Text style={styles.recipePrepTime}>Prep Time: {item.preparationTime} mins</Text>
      )}
      <Button
        title="View Details"
        onPress={() => {
          router.push(`/RecipeDetails/${item._id}`);
        }}
        color="#4A90E2"
      />
      <Button
        title="Delete"
        color="red"
        onPress={() => deleteRecipe(item._id)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Recipes</Text>
      <Button title="Add New Recipe" onPress={() => router.push('/AddRecipe')} />
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No recipes available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  recipeCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  recipePrepTime: {
    fontSize: 12,
    marginBottom: 10,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  separator: {
    height: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default RecipeList;
