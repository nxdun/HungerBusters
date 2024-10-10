import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, StyleSheet, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]); // To store filtered foods
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting state
  const [userRole, setUserRole] = useState(null);
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
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/foods`);
        setFoods(response.data);
        setFilteredFoods(response.data); // Initialize filtered foods with all foods
      } catch (error) {
        setError('Error fetching foods. Please try again later.');
        console.error("Error fetching foods", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [apiUrl]);

  useEffect(() => {
    filterAndSortFoods();
  }, [searchTerm, sortOrder]);

  const filterAndSortFoods = () => {
    let updatedFoods = [...foods];

    // Filter foods by search term
    if (searchTerm) {
      updatedFoods = updatedFoods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort foods alphabetically
    updatedFoods.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredFoods(updatedFoods);
  };

  const deleteFood = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/foods/delete/${id}`);
      setFoods(foods.filter(food => food._id !== id));
      setFilteredFoods(filteredFoods.filter(food => food._id !== id)); // Remove from filtered list
      Alert.alert('Success', 'Food deleted successfully');
    } catch (error) {
      console.error("Error deleting food", error);
      Alert.alert('Error', 'Failed to delete food');
    }
  };

  const renderFoodItem = ({ item }) => {
    const imageUrl = item.image ? `${apiUrl}/${item.image}` : null;

    return (
      <View style={styles.foodCard}>
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
        <Text style={styles.foodName}>{item.name}</Text>
        <Button
          title="View Details"
          onPress={() => {
            router.push(`/FoodDetails/${item._id}`);
          }}
          color="#4A90E2"
        />
        {userRole === 'admin' && (
          <Button
            title="Delete"
            color="red"
            onPress={() => deleteFood(item._id)}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading foods...</Text>
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
      <Text style={styles.title}>All Foods</Text>

      {/* Count Card */}
      <View style={styles.countCard}>
        <Icon name="cutlery" size={30} color="#4A90E2" style={styles.icon} />
        <Text style={styles.countText}>
          {filteredFoods.length} {filteredFoods.length === 1 ? 'Food Item' : 'Food Items'} Available
        </Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Sorting Buttons */}
      <View style={styles.sortButtons}>
        <Button
          title="Sort A-Z"
          onPress={() => setSortOrder('asc')}
          color={sortOrder === 'asc' ? '#4A90E2' : '#ccc'}
        />
        <Button
          title="Sort Z-A"
          onPress={() => setSortOrder('desc')}
          color={sortOrder === 'desc' ? '#4A90E2' : '#ccc'}
        />
      </View>

      {userRole === 'admin' && (
        <Button title="Add New Food" onPress={() => router.push('/AddFood')} />
      )}
      <FlatList
        data={filteredFoods}
        renderItem={renderFoodItem}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No foods available.</Text>}
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
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  foodCard: {
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
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  noImageText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
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

export default FoodList;
