import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Importing icons
import { router } from 'expo-router';
import ShaderCanvas from '../shaderCanvas';
import CustomButton from '../../components/CustomButton';
import { images } from '../../constants';

const Home = () => {
  return (
    <>
      <ShaderCanvas />
      <SafeAreaView className="flex-1">
        <ScrollView className="px-4">
          {/* Header Section */}
          <View className="flex-row justify-between items-center mt-8">
            <View>
              <Text className="text-base text-gray-100">Welcome To</Text>
              <Text className="text-3xl font-bold text-white">
                HungerBusters
              </Text>
            </View>
            <Image
              source={images.logo}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>

          {/* Grid with buttons */}
          <View className="flex flex-row flex-wrap justify-between mt-10">
            {/* Donations */}
            <View className="w-[47%] h-[200px] bg-teal-400 rounded-xl shadow-lg mb-4">
              <View className="p-4 flex-1 justify-between">
                <MaterialIcons name="volunteer-activism" size={36} color="white" />
                <Text className="text-xl text-white mt-2">Donations</Text>
                <CustomButton
                  title="Donate Now"
                  handlePress={() => router.push('/donations')}
                  containerStyles="mt-auto bg-white"
                  textStyles="text-teal-600"
                />
              </View>
            </View>

            {/* Experts */}
            <View className="w-[47%] h-[200px] bg-sky-950 rounded-xl shadow-lg mb-4">
              <View className="p-4 flex-1 justify-between">
                <FontAwesome5 name="user-tie" size={36} color="white" />
                <Text className="text-xl text-white mt-2">Experts</Text>
                <CustomButton
                  title="Consult"
                  handlePress={() => router.push('/expert-dashboard')}
                  containerStyles="mt-auto bg-white"
                  textStyles="text-sky-950"
                />
              </View>
            </View>

            {/* Health */}
            <View className="w-[47%] h-[200px] bg-yellow-400 rounded-xl shadow-lg mb-4">
              <View className="p-4 flex-1 justify-between">
                <MaterialIcons name="health-and-safety" size={36} color="white" />
                <Text className="text-xl text-white mt-2">Health</Text>
                <CustomButton
                  title="Learn More"
                  handlePress={() => router.push('#')}
                  containerStyles="mt-auto bg-white"
                  textStyles="text-yellow-600"
                />
              </View>
            </View>

            {/* Food Details */}
            <View className="w-[47%] h-[200px] bg-blue-600 rounded-xl shadow-lg mb-4">
              <View className="p-4 flex-1 justify-between">
                <MaterialIcons name="fastfood" size={36} color="white" />
                <Text className="text-xl text-white mt-2">Food Details</Text>
                <CustomButton
                  title="View"
                  handlePress={() => router.push('/FoodList')}
                  containerStyles="mt-auto bg-white"
                  textStyles="text-blue-600"
                />
              </View>
            </View>

            {/* Food Recipes */}
            <View className="w-[47%] h-[200px] bg-orange-400 rounded-xl shadow-lg mb-4">
              <View className="p-4 flex-1 justify-between">
                <FontAwesome5 name="utensils" size={36} color="white" />
                <Text className="text-xl text-white mt-2">Food Recipes</Text>
                <CustomButton
                  title="Browse"
                  handlePress={() => router.push('/RecipeList')}
                  containerStyles="mt-auto bg-white"
                  textStyles="text-orange-600"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;
