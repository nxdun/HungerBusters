import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur'; // Import Expo Blur
import { images } from "../../constants";
import ShaderCanvas from "../shaderCanvas";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import TransparentTopBar from "../../components/TransparentTopBar"; // Importing the TransparentTopBar component
const dummyRequest = {
  title: "Request title",
  submissionDate: "2024/08/12",
  description: "fresh food, home made",
  status: "On Refrigerator",
  location: "Location",
  deliveryDate: "2024/08/12",
  foodLifeTime: 24, // Default to 24 Hours
  images: [
    { id: 1, source: images.logo },
    { id: 2, source: images.profile },
  ],
};

const timeOptions = [6, 12, 24, 1, 3, 7, 30, 60]; // Time options in hours and days

const PendingRequests = () => {
  const [selectedTag, setSelectedTag] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [foodLifeTime, setFoodLifeTime] = useState(dummyRequest.foodLifeTime);
  const [title, setTitle] = useState(dummyRequest.title);

  const nextImage = () => {
    if (currentImageIndex < dummyRequest.images.length - 1) {
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
    router.push("/expert-dashboard"); // Navigate back to home or any other page
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Shader Background */}
      <ShaderCanvas />

      <View className="flex-grow">
        {/* top bar reusable component */}
        <TransparentTopBar title={title} onBackPress={handleBackPress} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 60 }}>
          {/* Image Carousel with blur background */}
          <View className="items-center relative mb-4">
            <TouchableOpacity
              style={{ position: 'absolute', left: 10, top: '50%', transform: [{ translateY: -12 }] }}
              onPress={prevImage}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <BlurView intensity={90} tint="light" className="h-56 w-64 rounded-lg overflow-hidden border border-black">
              <Image
                source={dummyRequest.images[currentImageIndex].source}
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

          {/* Request Details (blur box with a border and centered content) */}
          <BlurView intensity={90} tint="light" className="rounded-lg p-4 my-2 mx-4 border border-black">
            <Text className="font-bold">Submission Date:</Text>
            <Text>{dummyRequest.submissionDate}</Text>

            <Text className="font-bold mt-2">Provided Description:</Text>
            <Text>{dummyRequest.description}</Text>

            <Text className="font-bold mt-2">Current Status:</Text>
            <Text>{dummyRequest.status}</Text>

            <Text className="font-bold mt-2">Approx. Location:</Text>
            <Text>{dummyRequest.location}</Text>

            <Text className="font-bold mt-2">Delivery Date:</Text>
            <Text>{dummyRequest.deliveryDate}</Text>
          </BlurView>

          {/* Time Adjustment */}
          <BlurView intensity={90} tint="light" className="rounded-lg p-4 my-2 mx-4 border border-black">
            <View className="flex-row items-center justify-between mt-2">
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={handleDecrementTime}
              >
                <Ionicons name="remove" size={24} color="black" />
              </TouchableOpacity>
              <Text>
                {selectedTag === "Expired" ? "NOT AVAILABLE" : `${foodLifeTime} ${foodLifeTime >= 24 ? 'Days' : 'Hours'}`}
              </Text>
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg"
                onPress={handleIncrementTime}
              >
                <Ionicons name="add" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Assign Tag Dropdown */}
          <BlurView intensity={90} tint="light" className="px-4 py-3 rounded-lg mx-4 border border-black">
            <Text className="mb-2 font-bold">Assign Tag</Text>
            <View className="border rounded-lg overflow-hidden">
              <Picker
                selectedValue={selectedTag}
                onValueChange={(itemValue) => setSelectedTag(itemValue)}
              >
                <Picker.Item label="Select Tag" value="" />
                <Picker.Item label="Approved" value="Approved" />
                <Picker.Item label="Rejected" value="Rejected" />
                <Picker.Item label="Expired" value="Expired" />
              </Picker>
            </View>
          </BlurView>

          {/* Submit Button after tag assignment */}
          <View className="mt-4 mb-[70px] px-4">
            <CustomButton
              title="Submit"
              handlePress={handleApprove}
              containerStyles="w-full"
              textStyles="text-lg"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PendingRequests;
