import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
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
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar visibility
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
      <View style={styles.recipeCard}>
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
        <Text style={styles.recipeName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.recipeDescription}>{item.description}</Text>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.timeContainer}>
            <View style={styles.infoItem}>
              <Icon name="clock-o" size={20} color="#4A90E2" />
              <Text style={styles.infoText}>{item.prepTime} mins</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="hourglass-start" size={20} color="#4A90E2" />
              <Text style={styles.infoText}>{item.cookTime} mins</Text>
            </View>
          </View>
          <View style={styles.servingsContainer}>
            <View style={styles.infoItem}>
              <Icon name="flag" size={20} color="#4A90E2" />
              <Text style={styles.infoText}>{item.difficulty}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="users" size={20} color="#4A90E2" />
              <Text style={styles.infoText}>{item.servings} servings</Text>
            </View>
          </View>
        </View>

        <Button
          title="View Details"
          onPress={() => {
            router.push(`/RecipeDetails/${item._id}`);
          }}
          color="#4A90E2"
        />
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

      <TextInput
        style={styles.searchInput}
        placeholder="Search Recipes..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <TouchableOpacity style={styles.sidebarToggle} onPress={() => setShowSidebar(!showSidebar)}>
        <Text style={styles.sidebarToggleText}>Toggle Filters</Text>
      </TouchableOpacity>

      {showSidebar && (
        <View style={styles.sidebar}>
          <View style={styles.filterContainer}>
            <View style={styles.sortFilter}>
              <Text style={styles.filterLabel}>Sort By:</Text>
              <Picker
                selectedValue={sortOption}
                style={styles.picker}
                onValueChange={(itemValue) => setSortOption(itemValue)}
              >
                <Picker.Item label="Select Option" value="" />
                <Picker.Item label="A-Z" value="a-z" />
                <Picker.Item label="Z-A" value="z-a" />
                <Picker.Item label="Prep Time" value="prepTime" />
                <Picker.Item label="Cook Time" value="cookTime" />
              </Picker>
            </View>

            <View style={styles.difficultyFilter}>
              <Text style={styles.filterLabel}>Filter by Difficulty:</Text>
              <Picker
                selectedValue={difficultyFilter}
                style={styles.picker}
                onValueChange={(itemValue) => setDifficultyFilter(itemValue)}
              >
                <Picker.Item label="All" value="" />
                <Picker.Item label="Easy" value="Easy" />
                <Picker.Item label="Medium" value="Medium" />
                <Picker.Item label="Hard" value="Hard" />
              </Picker>
            </View>
          </View>

          <View style={styles.resetContainer}>
            <Button title="Reset Filters" onPress={resetFilters} color="#d9534f" />
          </View>
        </View>
      )}

      <View style={styles.countCard}>
        <Icon name="book" size={30} color="#4A90E2" style={styles.icon} />
        <Text style={styles.countText}>
          {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Available
        </Text>
      </View>

      {userRole === 'admin' && (
        <Button title="Add New Recipe" onPress={() => router.push('/AddRecipe')} />
      )}
      <FlatList
        data={filteredRecipes}
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sidebarToggle: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  sidebarToggleText: {
    color: '#fff',
    fontSize: 16,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    zIndex: 10,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sortFilter: {
    marginBottom: 20,
  },
  difficultyFilter: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resetContainer: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  recipeCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  noImageText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  recipeDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  servingsContainer: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    marginLeft: 5,
    color: '#555',
  },
  countCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e7f0fe',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
});

export default RecipeList;
