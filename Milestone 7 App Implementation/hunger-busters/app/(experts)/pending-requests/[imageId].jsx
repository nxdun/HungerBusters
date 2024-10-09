import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur'; 
import { useRouter, useLocalSearchParams } from 'expo-router';  // Update import to useRouter and useSearchParams
import ShaderCanvas from "../../shaderCanvas";
import CustomButton from "../../../components/CustomButton";
import TransparentTopBar from "../../../components/TransparentTopBar"; 

const timeOptions = [6, 12, 24, 1, 3, 7, 30, 60]; 

const PendingRequests = () => {
  const [selectedTag, setSelectedTag] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [foodLifeTime, setFoodLifeTime] = useState(24); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [images, setImages] = useState([]);
  const { imageId }= useLocalSearchParams();  
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();  // Use router from expo-router

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/fsr/get/${imageId}`);
        const data = await response.json();
        console.log(`${apiUrl}/api/fsr/get/${imageId}`)
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
        setDeliveryDate(data.deliveryDate);
        setSubmissionDate(data.submissionDate);
        setImages(data.images);
        setFoodLifeTime(data.foodLifeTime);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (imageId) {
      fetchData(); 
    }
  }, [imageId]);

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleApprove = () => {
    console.log("Request Approved!");
    // Add your approve functionality here
  };

  const handleIncrementTime = () => {
    if (selectedTag !== "Expired") {
      const currentIndex = timeOptions.indexOf(foodLifeTime);
      if (currentIndex < timeOptions.length - 1) {
        setFoodLifeTime(timeOptions[currentIndex + 1]);
      }
    }
  };

  const handleDecrementTime = () => {
    if (selectedTag !== "Expired") {
      const currentIndex = timeOptions.indexOf(foodLifeTime);
      if (currentIndex > 0) {
        setFoodLifeTime(timeOptions[currentIndex - 1]);
      }
    }
  };

  const handleBackPress = () => {
    router.push("/expert-dashboard");  // Use router.push to navigate
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ShaderCanvas />
      <View className="flex-grow">
        <TransparentTopBar title={title} onBackPress={handleBackPress} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 60 }}>
          <View className="items-center relative mb-4">
            <TouchableOpacity
              style={{ position: 'absolute', left: 10, top: '50%', transform: [{ translateY: -12 }] }}
              onPress={prevImage}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <BlurView intensity={90} tint="light" className="h-56 w-64 rounded-lg overflow-hidden border border-black">
              <Image
                source={{ uri: images[currentImageIndex]?.source }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </BlurView>
            <TouchableOpacity
              style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -12 }] }}
              onPress={nextImage}
            >
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <BlurView intensity={90} tint="light" className="rounded-lg p-4 my-2 mx-4 border border-black">
            <Text className="font-bold">Submission Date:</Text>
            <Text>{new Date(submissionDate).toLocaleDateString()}</Text>

            <Text className="font-bold mt-2">Provided Description:</Text>
            <Text>{description}</Text>

            <Text className="font-bold mt-2">Current Status:</Text>
            <Text>{status}</Text>

            <Text className="font-bold mt-2">Approx. Location:</Text>
            <Text>Location Placeholder</Text>

            <Text className="font-bold mt-2">Delivery Date:</Text>
            <Text>{new Date(deliveryDate).toLocaleDateString()}</Text>
          </BlurView>

          <BlurView intensity={90} tint="light" className="rounded-lg p-4 my-2 mx-4 border border-black">
            <View className="flex-row items-center justify-between mt-2">
              <TouchableOpacity className="bg-gray-300 p-2 rounded-lg" onPress={handleDecrementTime}>
                <Ionicons name="remove" size={24} color="black" />
              </TouchableOpacity>
              <Text>
                {selectedTag === "Expired" ? "NOT AVAILABLE" : `${foodLifeTime} ${foodLifeTime >= 24 ? 'Days' : 'Hours'}`}
              </Text>
              <TouchableOpacity className="bg-gray-300 p-2 rounded-lg" onPress={handleIncrementTime}>
                <Ionicons name="add" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </BlurView>

          <BlurView intensity={90} tint="light" className="px-4 py-3 rounded-lg mx-4 border border-black">
            <Text className="mb-2 font-bold">Assign Tag</Text>
            <View className="border rounded-lg overflow-hidden">
              <Picker selectedValue={selectedTag} onValueChange={(itemValue) => setSelectedTag(itemValue)}>
                <Picker.Item label="Select Tag" value="" />
                <Picker.Item label="Approved" value="Approved" />
                <Picker.Item label="Rejected" value="Rejected" />
                <Picker.Item label="Expired" value="Expired" />
              </Picker>
            </View>
          </BlurView>

          <View className="mt-4 mb-[70px] px-4">
            <CustomButton title="Submit" handlePress={handleApprove} containerStyles="w-full mb-4" textStyles="text-lg" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default PendingRequests;
