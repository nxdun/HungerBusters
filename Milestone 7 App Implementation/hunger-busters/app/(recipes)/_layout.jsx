import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const FoodLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="RecipeList"
          options={{ headerShown: false }} // Hides the header for this screen
        />
        <Stack.Screen
          name="AddRecipe"
          options={{ headerShown: false }} // Hides the header for this screen
        />
        <Stack.Screen
          name="RecipeDetails/[recipesId]" // Dynamic route for food details
          options={{ headerShown: false }} // Hides the header for this screen
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default FoodLayout;
