import { View, Text, } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const DonationLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="donate"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="donation-request"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="elder-donations"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="school-donations"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622"
        style="light"
      />
    </>
  )
}

export default DonationLayout