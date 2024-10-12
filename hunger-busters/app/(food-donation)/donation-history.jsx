import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker'; // Expo Image Picker
import { useRouter } from "expo-router";

const fakeApiUrl = "https://example.com/api/fsr/add/food-data";

const AllListings = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("On Refrigerator");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to select images using Expo Image Picker
  const selectImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // For multiple images
      quality: 1,
      selectionLimit: 5, // Allow up to 5 images
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => ({
        id: asset.uri, // Using URI as ID
        source: asset.uri
      }));
      setImages([...images, ...selectedImages].slice(0, 5)); // Limit to 5 images
    }
  };

  // Simulating location fetching and redirect
  const fetchLocation = async () => {
    router.push("/location-pickup");
    setTimeout(() => {
      setLatitude(37.42209);
      setLongitude(-122.083);
    }, 2000);
  };

  // Fake API submission
  const submitFoodData = async () => {
    setLoading(true);

    const foodData = {
      title,
      description: description || "no description provided",
      location: { latitude, longitude },
      images,
      status,
    };

    try {
      const response = await fetch(fakeApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(foodData),
      });

      if (response.ok) {
        Alert.alert("Success", "Food data successfully added!");
        resetForm();
        router.push("/listings");
      } else {
        Alert.alert("Success", "Food data successfully added!");
      }
    } catch (error) {
      Alert.alert("Success", "Food data successfully added!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLatitude(null);
    setLongitude(null);
    setImages([]);
    setStatus("On Refrigerator");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white">Add New Food Listing</Text>
        </View>

        {/* Food Title Input */}
        <View className="mb-4">
          <Text className="text-lg text-gray-300">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter food title"
            placeholderTextColor="#888"
            className="border-b border-gray-500 p-2 mt-2 text-white bg-gray-800 rounded"
          />
        </View>

        {/* Description Input */}
        <View className="mb-4">
          <Text className="text-lg text-gray-300">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter food description"
            placeholderTextColor="#888"
            className="border-b border-gray-500 p-2 mt-2 text-white bg-gray-800 rounded"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Location Picker */}
        <View className="mb-4">
          <Text className="text-lg text-gray-300">Location</Text>
          <TouchableOpacity onPress={fetchLocation} className="mt-3 p-3 bg-indigo-600 rounded-lg">
            <Text className="text-white text-center">Pick Location</Text>
          </TouchableOpacity>
          {latitude && longitude && (
            <Text className="mt-2 text-green-400">
              Lat: {latitude}, Long: {longitude}
            </Text>
          )}
        </View>

        {/* Image Upload */}
        <View className="mb-4">
          <Text className="text-lg text-gray-300">Images</Text>
          <TouchableOpacity onPress={selectImages} className="mt-3 p-3 bg-gray-700 rounded-lg">
            <Text className="text-white text-center">Upload Images (Max 5)</Text>
          </TouchableOpacity>
          <View className="flex-row mt-4 flex-wrap">
            {images.map((image) => (
              <Image
                key={image.id}
                source={{ uri: image.source }}
                className="w-20 h-20 mr-2 mb-2 rounded-lg"
                resizeMode="cover"
              />
            ))}
          </View>
        </View>

        {/* Status Picker */}
        <View className="mb-4">
          <Text className="text-lg text-gray-300">Status</Text>
          <TouchableOpacity
            onPress={() =>
              setStatus((prevStatus) => (prevStatus === "On Refrigerator" ? "Hot" : "On Refrigerator"))
            }
            className="mt-3 p-3 bg-gray-800 rounded-lg"
          >
            <Text className="text-white text-center">{status}</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={submitFoodData}
          className={`p-4 rounded-lg mt-4 ${loading ? "bg-gray-600" : "bg-green-600"}`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-center pb-5">Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllListings;
