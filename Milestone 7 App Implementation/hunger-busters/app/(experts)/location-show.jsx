import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { BlurView } from "expo-blur";
import CustomButton from "../../components/CustomButton"; // Assuming you have this reusable button
import { styled } from "nativewind"; // For NativeWind styling

const PickupLocationScreen = ({ route }) => {
  //   const { location, pickupTime } = a.params;
  //set sample data for location and pickup time
  const location = {
    latitude: 37.78825,
    longitude: -122.4324,
  };
  const pickupTime = "12:00 PM";

  const handleReportProblem = () => {
    Alert.alert("Report", "You have reported a problem with the pickup.");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MapView
        className="w-full h-[60%]"
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        scrollEnabled={false} // Disable interaction as it's just for display
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Pickup Location"
        />
      </MapView>

      <BlurView
        intensity={50}
        className="absolute bottom-0 w-full p-5 rounded-t-3xl bg-white/90"
      >
        <Text className="text-xl font-bold mb-4">Pickup Location</Text>

        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm font-semibold">Location:</Text>
            <Text className="text-xs text-gray-700">
              Lat: {location.latitude.toFixed(5)}, Long:{" "}
              {location.longitude.toFixed(5)}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold">Pickup Time:</Text>
          <Text className="text-lg font-bold">
            {pickupTime ? pickupTime : "N/A"}
          </Text>
        </View>

        <CustomButton
          title="Report a Problem"
          handlePress={handleReportProblem}
          containerStyles="w-full bg-red-500 mb-4"
        />

        <CustomButton
          title="Successful"
          handlePress={() => Alert.alert("Success", "Pickup confirmed!")}
          containerStyles="w-full bg-green-500"
        />
      </BlurView>
    </SafeAreaView>
  );
};

export default PickupLocationScreen;
