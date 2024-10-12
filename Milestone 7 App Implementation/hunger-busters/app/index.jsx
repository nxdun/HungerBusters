import { Image, ScrollView, Text, View } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { LogBox } from 'react-native';
export default function App() {
  LogBox.ignoreAllLogs(); //it ignore all the logs from app, shows in console
    return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height:'100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image 
            source={images.logo}
            className="w-[200px] h-[160px]"
            resizeMode="contain"
          />
          <Image 
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-center text-white">
              Welcome to<Text className="text-secondary-200"> Hunger Busters</Text>
            </Text>
            <Image 
            source={images.path}
            className="w-[130px] h-[15px] absolute -bottom-2 -right-1"
            resizeMode="contain"
          />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center ">
            Food for Everyone Zero Hunger
          </Text>
          
          <CustomButton title="Get Started"
          handlePress={()=> router.push('/sign-in')}
          containerStyles="w-full mt-7" 
          />
          
          {/* <Link href="/home" className="text-center mt-3">
            <Text className="text-sm font-pregular text-gray-100">
              (dev) link
            </Text>
          </Link> */}


          <StatusBar backgroundColor="#161622" style="light" />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
