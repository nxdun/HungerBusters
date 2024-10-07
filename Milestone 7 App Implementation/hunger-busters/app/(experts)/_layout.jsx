import { View, Text, } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

function ExpertLayout() {
    return (
        <>
          <Stack>
            <Stack.Screen
              name="expert-dashboard"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar backgroundColor="#ffffff"
            style="dark"
          />
        </>
      )
}

export default ExpertLayout