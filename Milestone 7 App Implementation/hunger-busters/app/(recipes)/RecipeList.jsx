import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome for icons

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      {userRole === 'admin' && ( // Conditional rendering based on user role
        <Button
          title="Delete"
          color="red"
          onPress={() => deleteRecipe(item._id)}
        />
      )}
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
      
      {/* Count of Recipes Card */}
      <View style={styles.countCard}>
      <Icon name="book" size={30} color="#4A90E2" style={styles.icon} />
        <Text style={styles.countText}>
          {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'} Available
        </Text>
      </View>

      {userRole === 'admin' && ( // Conditional rendering based on user role
        <Button title="Add New Recipe" onPress={() => router.push('/AddRecipe')} />
      )}
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
  countCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  countText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A90E2', // Change color to match your theme
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
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default RecipeList;
