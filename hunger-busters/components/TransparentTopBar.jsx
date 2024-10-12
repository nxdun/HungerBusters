import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const TransparentTopBar = ({ title, onBackPress }) => {
  return (
    <View className="p-1 shadow-sm">
      <BlurView intensity={110} tint="light" className="rounded-b-3xl">
        <View className="flex-row justify-center items-center p-4">
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black flex-1 text-center">
            {title}
          </Text>
        </View>
      </BlurView>
    </View>
  );
};

export default TransparentTopBar;
