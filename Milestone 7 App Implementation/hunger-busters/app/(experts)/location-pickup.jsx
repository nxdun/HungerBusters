import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';
import CustomButton from "../../components/CustomButton"; // Assuming you have this reusable button
import { styled } from 'nativewind'; // For NativeWind styling

const { width, height } = Dimensions.get('window');

const PickupScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [customLocation, setCustomLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleConfirmLocation = () => {
    const finalLocation = customLocation || location;
    if (!finalLocation) {
      Alert.alert("Error", "Location not set");
      return;
    }
    Alert.alert("Location Confirmed", `Your location has been set to: Lat: ${finalLocation.latitude}, Long: ${finalLocation.longitude}`);
  };

  const handleSetCustomLocation = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCustomLocation({ latitude, longitude });
    setMapRegion({
      ...mapRegion,
      latitude,
      longitude,
    });
  };

  const useCurrentLocation = () => {
    if (location) {
      setCustomLocation(null); // Reset custom location
      setMapRegion({
        ...mapRegion,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } else {
      Alert.alert("Error", "Current location not available");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MapView
        className="w-full h-[70%]"
        region={mapRegion}
        onPress={handleSetCustomLocation}
        showsUserLocation
      >
        {customLocation ? (
          <Marker
            coordinate={customLocation}
            title="Custom Location"
            description="You set this location"
          />
        ) : location ? (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Your Current Location"
          />
        ) : null}
      </MapView>

      <BlurView intensity={50} className="absolute bottom-0 w-full p-5 rounded-t-3xl bg-white/90">
        <Text className="text-xl font-bold mb-4">Select Pickup Location</Text>
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg"
            onPress={useCurrentLocation}
          >
            <Text className="text-white text-center">Use Current Location</Text>
          </TouchableOpacity>
          <View className="flex-1 ml-4">
            <Text className="text-sm font-semibold">Location:</Text>
            <Text className="text-xs text-gray-700">
              {customLocation
                ? `Custom Location: Lat ${customLocation.latitude}, Long ${customLocation.longitude}`
                : location
                ? `Current Location: Lat ${location.latitude}, Long ${location.longitude}`
                : "Waiting for location..."}
            </Text>
          </View>
        </View>

        <CustomButton title="Confirm" handlePress={handleConfirmLocation} containerStyles="w-full mt-4 bg-green-500" />
      </BlurView>
    </SafeAreaView>
  );
};

export default PickupScreen;
