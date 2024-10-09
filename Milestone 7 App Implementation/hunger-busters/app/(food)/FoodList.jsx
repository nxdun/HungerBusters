import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const FoodList = () => {
  const [foods, setFoods] = useState([]);
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
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/foods`);
        setFoods(response.data);
      } catch (error) {
        setError('Error fetching foods. Please try again later.');
        console.error("Error fetching foods", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [apiUrl]);

  const deleteFood = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/foods/delete/${id}`);
      setFoods(foods.filter(food => food._id !== id));
      Alert.alert('Success', 'Food deleted successfully');
    } catch (error) {
      console.error("Error deleting food", error);
      Alert.alert('Error', 'Failed to delete food');
    }
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodCard}>
      <Text style={styles.foodName}>{item.name}</Text>
      <Button
        title="View Details"
        onPress={() => {
          // Navigate to FoodDetails with foodId as a parameter
          router.push(`/FoodDetails/${item._id}`);
        }}
        color="#4A90E2"
      />
      {userRole === 'admin' && ( // Conditional rendering based on user role
        <Button
          title="Delete"
          color="red"
          onPress={() => deleteFood(item._id)}
        />
      )}
    </View>
  );

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
      {userRole === 'admin' && ( // Conditional rendering based on user role
        <Button title="Add New Food" onPress={() => router.push('/AddFood')} />
      )}
      <FlatList
        data={foods}
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
