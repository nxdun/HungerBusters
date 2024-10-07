import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const FoodLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="FoodList"
          options={{ headerShown: false }} // Hides the header for this screen
        />
        <Stack.Screen
          name="AddFood"
          options={{ headerShown: false }} // Hides the header for this screen
        />
        <Stack.Screen
          name="FoodDetails/[foodId]" // Dynamic route for food details
          options={{ headerShown: false }} // Hides the header for this screen
        />
        <Stack.Screen
          name="UpdateFood/[foodId]" // Dynamic route for updating food
          options={{ headerShown: false }} // Hides the header for this screen
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default FoodLayout;
