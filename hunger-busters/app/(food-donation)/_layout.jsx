import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const FoodDonationLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
        }}
      >
         <Tabs.Screen
          name="landing"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="home" color={color} focused={focused} />
            ),
            headerShown: false,
            
          }}
        />
        <Tabs.Screen
          name="list-surplus-food"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="list" color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="donation-history"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="create" color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="location-show"
          options={{
            title: "",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="location" color={color} focused={focused} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
      <StatusBar style="light" />
    </View>
  );
};

const TabIcon = ({ icon, color, focused }) => {
  return (
    <View className="items-center justify-center">
      <Ionicons name={icon} size={24} color={color} />
      <Text
        className={`text-xs ${focused ? "font-bold" : ""}`}
        style={{ color }}
      >
        {icon.charAt(0).toUpperCase() + icon.slice(1)}
      </Text>
    </View>
  );
};

export default FoodDonationLayout;
