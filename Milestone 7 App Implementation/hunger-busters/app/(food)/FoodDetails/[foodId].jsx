import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet, ScrollView, TextInput } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { usePathname } from 'expo-router';

const FoodDetails = () => {
  const router = useRouter();
  const pathname = usePathname();
  const foodId = pathname.split('/').pop(); // Get foodId from URL path
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [food, setFood] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        if (!foodId) throw new Error('Food ID is missing');

        const response = await axios.get(`${apiUrl}/api/foods/${foodId}`);
        setFood(response.data);
        console.log("Fetched food details:", response.data);
      } catch (error) {
        setError(error.message || 'Error fetching food details. Please try again later.');
        console.error("Error fetching food details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId, apiUrl]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/api/foods/delete/${foodId}`);
      Alert.alert('Success', 'Food deleted successfully');
      router.push('/FoodList');
    } catch (error) {
      console.error("Error deleting food", error);
      Alert.alert('Error', 'Failed to delete food');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${apiUrl}/api/foods/update/${foodId}`, food);
      Alert.alert('Success', 'Food updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error("Error updating food", error);
      Alert.alert('Error', 'Failed to update food');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Loading food details...</Text>
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

  if (!food) {
    return (
      <View style={styles.centered}>
        <Text>No food details available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{food.name}</Text>
      <Text style={styles.description}>{food.description || "No description available."}</Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Nutritional Information</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Calories:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.calories)}
              onChangeText={(text) => setFood({ ...food, calories: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.calories}</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Fat:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.fat)}
              onChangeText={(text) => setFood({ ...food, fat: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.fat} g</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Saturated Fat:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.saturatedFat)}
              onChangeText={(text) => setFood({ ...food, saturatedFat: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.saturatedFat} g</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Cholesterol:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.cholesterol)}
              onChangeText={(text) => setFood({ ...food, cholesterol: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.cholesterol} mg</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Sodium:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.sodium)}
              onChangeText={(text) => setFood({ ...food, sodium: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.sodium} mg</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Potassium:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.potassium)}
              onChangeText={(text) => setFood({ ...food, potassium: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.potassium} mg</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Total Carbohydrates:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.totalCarbs)}
              onChangeText={(text) => setFood({ ...food, totalCarbs: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.totalCarbs} g</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Dietary Fiber:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.dietaryFiber)}
              onChangeText={(text) => setFood({ ...food, dietaryFiber: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.dietaryFiber} g</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Sugar:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.sugar)}
              onChangeText={(text) => setFood({ ...food, sugar: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.sugar} g</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Protein:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.protein)}
              onChangeText={(text) => setFood({ ...food, protein: Number(text) })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.protein} g</Text>
          )}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Vitamins</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Vitamin C:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.vitamins?.vitaminC || 0)}
              onChangeText={(text) => setFood({ ...food, vitamins: { ...food.vitamins, vitaminC: Number(text) } })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.vitamins?.vitaminC || 0} mg</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Vitamin D:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.vitamins?.vitaminD || 0)}
              onChangeText={(text) => setFood({ ...food, vitamins: { ...food.vitamins, vitaminD: Number(text) } })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.vitamins?.vitaminD || 0} IU</Text>
          )}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Minerals</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Calcium:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.minerals?.calcium || 0)}
              onChangeText={(text) => setFood({ ...food, minerals: { ...food.minerals, calcium: Number(text) } })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.minerals?.calcium || 0} mg</Text>
          )}
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Iron:</Text>
          {editMode ? (
            <TextInput 
              style={styles.input}
              keyboardType="numeric"
              value={String(food.minerals?.iron || 0)}
              onChangeText={(text) => setFood({ ...food, minerals: { ...food.minerals, iron: Number(text) } })}
            />
          ) : (
            <Text style={styles.tableCell}>{food.minerals?.iron || 0} mg</Text>
          )}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title={editMode ? 'Save Changes' : 'Edit Food'} onPress={editMode ? handleUpdate : () => setEditMode(!editMode)} />
        <Button title="Delete Food" onPress={handleDelete} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  tableHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    borderRadius: 3,
    width: '40%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
  },
});

export default FoodDetails;
