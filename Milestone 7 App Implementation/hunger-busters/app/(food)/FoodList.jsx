import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for icons

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        console.log('Fetched foods:', response.data); // Log the fetched data
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

  const renderFoodItem = ({ item }) => {
    // Assuming item.image only contains the filename, e.g., "1728505407544-food.jpg"
    const imageUrl = item.image ? `${apiUrl}/${item.image}` : null; // Construct the URL
  
    console.log('Image URL:', imageUrl); // Log the constructed image URL for debugging
  
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
          {foods.length} {foods.length === 1 ? 'Food Item' : 'Food Items'} Available
        </Text>
      </View>

      {userRole === 'admin' && (
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
    width: '100%', // Adjust the width as needed
    height: 200,   // Adjust the height as needed
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
